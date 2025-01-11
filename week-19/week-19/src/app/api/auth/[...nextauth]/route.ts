import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',

      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)

        const username = credentials?.username;
        const passowrd = credentials?.password;

        console.log(username,passowrd);
        
        const user = {
          userName: "pratik",
          email:"praot@adim.vom"
        }
        // If no error and we have user data, return it
        if ( user) {
          return user
        }
        // Return null if user data could not be retrieved
        return null
      }
    })
  ]
})

export { handler as GET, handler as POST };