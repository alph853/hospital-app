from passlib.context import CryptContext

# Define the hashing context if not already defined
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Replace this with your plaintext password
plaintext_password = "databaseasm2@"

# Generate the hashed password
hashed_password = pwd_context.hash(plaintext_password)

print("Hashed Password:", hashed_password)
