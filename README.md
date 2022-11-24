DEMO: https://knz46416.cms.unibit.bg/yotpo-exercise/

**I dont send real SMS but mock the SMS provider by saving the title, message and phone in one of the database tables (sms_provider_mock)**

---



**Task name:**
OTP verification using an SMS message

**Task definition:**
You have to create a website registration which requires a phone number. The number should be validated, and the client wants to use the OTP (one time password) as a solution to that problem. To put it short, you have to send an actual text message to that phone, with a generated code which should be inserted in a validation form.

**Task requirements:**
 - Create a user registration page with the following fields -> an
   email, a phone, and a password. 
  - Make sure that we have a well formatted phone.  The customer may enter a number using special characters, e.g. 0885 (34-53-95). As you
   can see, the country code is missing, and since we need it, you have
   to prepend it if it is missing. Based on the previous example, the
   final and valid phone number should look like this: 359885345395.
- You have to create a validation of the phone number by sending a code to the provided number (How: You can mock an SMS provider by
   saving the messages in the database).
- Make sure that the user can only make 3 attempts of entering the validation code. If all three of them are wrong, add a 1 minute of
   “cooldown”.
- Create an option which can allow the system to send a new code to the customer. Make sure that this option is available only when at
   least 1 minute has passed since the original verification code was
   sent.
- Keep a log of all verification attempts.
-  After a successfully validated phone number, we have to send a confirmation SMS message, saying “Welcome to SMSBump!”

**Tech requirements:**
- The backend should work as a web service API and should only receive/send data to the front-end of the application. The backend should not be responsible for rendering the views of the application.
- The frontend should be written in React.js as a single-page-application (SPA) and should work with any given backend. You can use create-react-app to escape dealing with build configurations.
