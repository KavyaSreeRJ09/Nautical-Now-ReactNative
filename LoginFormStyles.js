import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  content: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  loginFormContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  button: {
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginVertical: 10,
  },
  loginButton: {
    backgroundColor: '#007BFF',
  },
  registerButton: {
    backgroundColor: '#28a745',
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
    color: '#666',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default styles;
