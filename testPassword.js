import bcrypt from 'bcrypt';

const testPassword = async () => {
  const password = 'userpassword';  // Plaintext password
  const hashedPassword = '$2b$10$GQLkyUMSjpZH5uHFG9ZfsuGFBicONlfuHgVv9n.sNW9YedmDxib5C';  // Sample hash

  try {
    const isValid = await bcrypt.compare(password, hashedPassword);
    console.log('Password validity:', isValid);  // Should return true
  } catch (error) {
    console.error('Error comparing passwords:', error);
  }
};

testPassword();
