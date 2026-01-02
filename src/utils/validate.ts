export const checkValidData = (email: string, password: string) => {
  const isEmailValid = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  const isPasswordValid = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(
    password
  );

  if (!isEmailValid) return "Email address is not valid";
  if (!isPasswordValid)
    return "Password must be at least 8 characters and contain a number";

  return null;
};
