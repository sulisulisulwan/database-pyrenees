
This API Server/SQL Database system is built primarily out of the native Node.js modules fs, Readline, and MySQL database.


# **ETL**

Its Promise-based ETL system is built to withstand the importing of large CSV files

- **Extraction:** Uses ReadLine module to stream data from CSV file
- **Transformation:**  An all in one formatter function that prepares the data.
- **Loading**  Features a simple and sturdy homebuilt buffering mechanism preventing heap overflow during SQL database load in.


## The Buffer
The buffer system ameliorates Readline's `.pause()` data bleed-over by counting the line data instances in a buffer counter, which decrements with every resolved SQL insertion query promise.  The Readline stream resumes (`.resume()`) when the buffer counter reaches 0.

This buffer system is its ability to be tested at a granular level if needed.
