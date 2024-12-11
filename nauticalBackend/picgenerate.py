import pickle

import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras.models import Sequential

# Load data from CSV file
df = pd.read_csv('C:\\React\\Nautical-Now-ReactNative-master\\Nautical-Now-ReactNative-master\\nauticalBackend\\Book1.csv')

# Convert DATETIME to datetime type
df['DATETIME'] = pd.to_datetime(df['DATETIME'], format='%d-%b-%y')
df.set_index('DATETIME', inplace=True)

# Select the SSH column
ssh_data = df['SSH'].values

# Normalize the data
scaler = MinMaxScaler(feature_range=(0, 1))
ssh_data = scaler.fit_transform(ssh_data.reshape(-1, 1))

# Split the data into training and testing sets
train_size = int(len(ssh_data) * 0.8)
train, test = ssh_data[:train_size], ssh_data[train_size:]

# Create the dataset for the LSTM
def create_dataset(data, look_back=1):
    X, Y = [], []
    for i in range(len(data) - look_back):
        a = data[i:(i + look_back), 0]
        X.append(a)
        Y.append(data[i + look_back, 0])
    return np.array(X), np.array(Y)

look_back = 10  # Number of previous time steps to use for prediction
X_train, y_train = create_dataset(train, look_back)
X_test, y_test = create_dataset(test, look_back)

# Reshape input to be [samples, time steps, features]
X_train = np.reshape(X_train, (X_train.shape[0], look_back, 1))
X_test = np.reshape(X_test, (X_test.shape[0], look_back, 1))

# Build the LSTM model
model = Sequential()
model.add(LSTM(50, return_sequences=True, input_shape=(look_back, 1)))
model.add(LSTM(50))
model.add(Dense(1))
model.compile(optimizer='adam', loss='mean_squared_error')

# Train the model
model.fit(X_train, y_train, epochs=100, batch_size=1, verbose=2)

# Save the model
model.save('lstm_model.h5')  # Save the model in HDF5 format
print('Model saved as lstm_model.h5')

# Save the scaler using pickle
with open('scaler.pkl', 'wb') as scaler_file:
    pickle.dump(scaler, scaler_file)

print('Scaler saved as scaler.pkl')
