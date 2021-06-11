import { parseCookies } from "nookies";
import client from "apollo-client";
import { gql } from "@apollo/client";

const Dashboard = ({ user }) => {
  return (
    <div className="mt-20 max-w-lg mx-auto shadow-md bg-white p-10">
      <h3 className="text-3xl">{user?.username}</h3>
      <p>{user.email}</p>
    </div>
  );
};

export default Dashboard;

export const getServerSideProps = async (ctx) => {
  const authData = parseCookies(ctx);

  const user = authData["elearning-user"];
  const parsedUser = user && JSON.parse(user);
  if (!authData["elearning-jwt"]) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }
  const { data } = await client.query({
    query: gql`
      query {            
        user(id: "${parsedUser.id}") {
          username
          email          
        }
      }
    `,
    context: {
      headers: { Authorization: "Bearer " + authData["elearning-jwt"] },
    },
  });

  return {
    props: { user: data.user },
  };
};
