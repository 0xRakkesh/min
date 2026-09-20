from database import get_db_connection


def get_next_sequence_value():
     conn = get_db_connection()
     cursor = conn.cursor()

     query = "SELECT nextval('link_table_id_seq');"
     cursor.execute(query)

     row = cursor.fetchone()
     next_id = row[0]

     cursor.close()
     conn.close()
     
     return next_id

def create_url(next_id: int, target_url: str, short_id: str):
     conn = get_db_connection()
     cursor = conn.cursor()

     query = "INSERT INTO link_table (id, target_url, short_id) VALUES (%s, %s, %s);"
     cursor.execute(query,(next_id, target_url, short_id))
     conn.commit()
     cursor.close()
     conn.close()

     return short_id

def get_url(short_id:str):
     conn = get_db_connection()
     cursor = conn.cursor()

     query = "SELECT target_url FROM link_table WHERE short_id = %s;"
     cursor.execute(query,(short_id,))

     row = cursor.fetchone()

     cursor.close()
     conn.close()

     if row:
          return row[0]
     return None

