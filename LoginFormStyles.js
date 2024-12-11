import { StyleSheet } from 'react-native';

const defaultColor = '#fff'; // Default application color


const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'contain' depending on the desired effect
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 20,
  },
  content: {
    width: '100%',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#6200EE', // Apply default color
  },
  loginFormContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background for better text visibility
    borderRadius: 10,
    padding: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#fff',
    borderBottomWidth: 1,
    color: '#fff',
  },

  button: {
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginVertical: 10,
  },
  loginButton: {
    backgroundColor: '#6200EE', // Apply default color
  },
  registerButton: {
    backgroundColor: '#6200EE',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  
  locationContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  locationInfo: {
    fontSize: 14,
    color: defaultColor, // Apply default color
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  errorContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'red',
    padding: 10,
  },
});

export default styles;
