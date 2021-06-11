import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { baseUrl } from "utils/baseUrl";
import Cookie from "js-cookie";
import { buttonClasses, inputClasses } from "components/ReusableClasses";

const Signup = () => {
  const router = useRouter();
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const { username, email, password } = values;

  const handleChange = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setError(null);
    if (!username || !email || !password) {
      setError("All fields are required");
      return;
    }
    const res = await fetch(`${baseUrl}/auth/local/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (res.ok) {
      Cookie.set("elearning-jwt", data.jwt);
      Cookie.set("elearning-user", JSON.stringify(data.user));

      setValues({ username: "", email: "", password: "" });
      router.replace("/");
    } else {
      setError(data.message[0].messages[0].message);
    }
  };
  return (
    <div className="mt-20 max-w-lg mx-auto shadow-md py-10 px-5 bg-white">
      <h2 className="text-2xl font-medium text-gray-500 text-center mb-3">
        Create an account
      </h2>
      <div className="mb-3 space-y-1">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          className={inputClasses()}
          value={username}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3 space-y-1">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          className={inputClasses()}
          value={email}
          onChange={handleChange}
        />
      </div>
      <div className="mb-3 space-y-1">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          className={inputClasses()}
          value={password}
          onChange={handleChange}
        />
      </div>
      {error && <div className="mb-3 text-center text-red-500">{error}</div>}
      <div className="mb-3 text-center">
        <button className={buttonClasses()} onClick={handleSubmit}>
          Sign Up
        </button>
      </div>
      <div className="text-center">
        <p>
          Already a user?{" "}
          <Link href="/auth/signin">
            <a className="text-yellow-500">Sign In</a>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
