from DEXcryptoLib.Lib import *
from datetime import datetime
import time 
import mysql.connector

class databaseSQL(object):
    def __init__(self, host, user, password, database):
        """
        Initializes the class with database connection information.

        Parameters:
        - host: The database host.
        - user: The username for the connection.
        - password: The password for the connection.
        - database: The database name.
        """
        self.host = host
        self.user = user
        self.password = password
        self.database = database
        self.connection = None
    def am_connected(self):
        """
        Return a boolean if am connected to the database.
        """
        return self.connection.is_connected()
    def connect(self):
        """
        Establishes a connection to the database using the provided information.
        """
        self.connection = mysql.connector.connect(
            host=self.host,
            user=self.user,
            password=self.password,
            database=self.database
        )
    def disconnect(self):
        """
        Closes the database connection if it is open.
        """
        if self.connection and self.connection.is_connected():
            self.connection.close()
    def execute_query(self, query):
        """
        Executes an SQL query and returns the results.

        Parameters:
        - query: The SQL query to execute.

        Returns:
        - The results of the query.
        """
        cursor = self.connection.cursor()
        cursor.execute(query)
        result = cursor.fetchall()
        cursor.close()
        return result
    def get_all_rows_from_table(self, table_name):
        """
        Retrieves all rows from a specified table.

        Parameters:
        - table_name: The name of the table to query.

        Returns:
        - The results of the query to fetch all rows from the table.
        """
        query = f"SELECT * FROM {table_name};"
        return self.execute_query(query)
    def insert_into_table(self, table_name, values):
        """
        Inserts values into the specified table.

        Parameters:
        - table_name: The name of the table to insert values into.
        - values: A dictionary containing values to be inserted.
        """
        columns = ', '.join(values.keys())
        placeholders = ', '.join(['%s'] * len(values))
        query = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders});"

        cursor = self.connection.cursor()
        try:
            cursor.execute(query, tuple(values.values()))
            self.connection.commit()
            log("db", "Insertion successful. (table: " + table_name + ") values: " + str(values))
        except Exception as e:
            log("db", f"Error during insertion: {e}")
            self.connection.rollback()
        finally:
            cursor.close()

def initDatabase():
    db_config = GetJSONConfig("db_config.json")  # Get db_config.json of logs in a {}
    if db_config == -1:
        with open("db_config.json", 'w') as f:
            json.dump({'host': 'localhost', 'user': 'user', 'pass': 'pass', 'database': 'smartswap'}, f, indent=2)
            print(f"Config file {'db_config.json'} has been created.")
            exit()
    return databaseSQL(db_config["host"], db_config["user"], db_config["pass"], db_config["database"])
        

def getConfig():
    config_file = "pairs_data_config.json"
    config = GetJSONConfig(config_file)  
    if config == -1:
        with open(config_file, 'w') as f:
            json.dump([{'pair_name': 'qs_matic_usdt', 'table_name': 'qs_matic_usdt', 'router': 'qs', 'tokenIn_decimal': 18, 'path': '["0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"]',"tokenOut_decimal": 6, "max_entries": 21600}], f, indent=2)
            print(f"Config file {config_file} has been created.")
            exit()
    return config

def initTable(db, configarray):
    """
    Checks if the 'table_name' table exists, and creates it if it doesn't.
    """
    pair_name = configarray["pair_name"] 
    table_name = configarray["table_name"]
    query_check_table = f"SHOW TABLES LIKE '{pair_name}';"
    result = db.execute_query(query_check_table) # Check if the table exists
    if not result: # Table does not exist, create it
        query_create_table = f"""
            CREATE TABLE {table_name} (
                date DATETIME PRIMARY KEY,
                price VARCHAR(50)
            );
        """
        db.execute_query(query_create_table) # Execute the create table query
        log(pair_name, f"Table '{pair_name}' created successfully.")
    #else:
        #log("db", f"Table '{table_name}' exists.")

def checkTable(db, configarray, max_entries): 
    """
    Cleans up the table by removing the oldest entries if the number of entries exceeds max_entries.
    """
    table_name = configarray["table_name"]
    rows = db.get_all_rows_from_table(table_name)
    rows_count = len(rows)
    if rows_count > max_entries:
        entries_to_remove = rows_count - max_entries # Calculate the number of entries to remove
        query_select_oldest = f"SELECT date FROM {table_name} ORDER BY date ASC LIMIT {entries_to_remove};" # query command to get oldest
        oldest_entries = db.execute_query(query_select_oldest) # Retrieve the oldest entries to remove
        if oldest_entries:
            oldest_dates = [entry[0] for entry in oldest_entries] # Extract the date values from the tuples
            for date in oldest_dates:  # Delete the oldest entries
                date_str = date.strftime('%Y-%m-%d %H:%M:%S') if isinstance(date, datetime) else date # If the 'date' variable is a datetime object, convert it to a string using the specified format, else leave it unchanged
                query_delete_entry = f"DELETE FROM {table_name} WHERE date = '{date_str}';" # Delete the element at date_str
                db.execute_query(query_delete_entry) # Delete the element at date_str
            log(configarray["pair_name"], f"Deleted {entries_to_remove} oldest entries from '{table_name}'.")
        else:
            log(configarray["pair_name"], "No entries to delete.")

#**DATABASE
db = initDatabase()
db.connect()
#**WEB3
polygonNet = Network(pol_RPC)  # Creating a Network object for the Polygon network using the specified RPC URL.
qsContract = Contract(polygonNet.web3, aQuickswap, abiQuickswap)  # Creating a Contract object for the Quickswap router with the specified address and ABI.
qs = Quickswap(polygonNet.web3, qsContract.contract, "", "")  # Creating a Quickswap object for interaction with the Quickswap router.

def checkSpamDB(price, last_price, last_date):
    if price == last_price:
        if (datetime.now() - last_date).total_seconds() > 3600: 
            return True 
        else:
            return False 
    else:
        return True 


while 1 == 1:
    config = getConfig()
    for i in range(len(config)):
        initTable(db, config[i])
        checkTable(db, config[i], config[i]["max_entries"])
        amount = 1 * (10 ** config[i]["tokenIn_decimal"])
        path = config[i]["path"] 
        price = qs.getAmountMin(amount, path)
        price = price / (1 * (10 ** config[i]["tokenOut_decimal"]))

        all_rows = db.get_all_rows_from_table(config[i]["table_name"])
        
        if all_rows:
            last_entry = all_rows[-1]
            last_date, last_price = last_entry[0], float(last_entry[1])
            if checkSpamDB(price, last_price, last_date) == True:
                values_to_insert = {
                    "date": datetime.now(),
                    "price": price
                }
                log(config[i]["pair_name"], "new row: " + str(len(all_rows) + 1) + " = " + str(values_to_insert))
                db.insert_into_table(config[i]["table_name"], values_to_insert)
        else:
            values_to_insert = {
                "date": datetime.now(),
                "price": price
            }
            log(config[i]["pair_name"], "new row: 1 = " + str(values_to_insert))
            db.insert_into_table(config[i]["table_name"], values_to_insert)
    time.sleep(60 * 2)
    #time.sleep(1)  # (debug)

