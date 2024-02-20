import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "../components/Button";

async function getData() {
  return await axios.get("http://localhost:8000/api/v1/users/current-user");
}

function Home() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState();
  useEffect(() => {
    getData()
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        if (error.request) {
          setError(error.request.message);
        } else if (error.response) {
          setError(error.response.data.message);
        } else {
          setError(error.message);
        }
      });
  }, []);

  if (!user) {
    return (
      <>
        <div className="flex-wrap flex flex-col">
          <div className="flex-wrap flex justify-center items-center m-4">
            <div>
              <img
                src="../public/index-3.jpg"
                alt=""
                height="400px"
                width="400px"
              />
            </div>
            <div>
              <p className="p-4 text-xl">
                Welcome to our Todo website,
                <br /> where organizing your tasks has never been easier.
                <br /> With our intuitive interface and powerful features, you
                can manage your tasks efficiently and stay productive throughout
                the day.
              </p>
            </div>
          </div>
          <div className="flex-wrap flex justify-center items-center m-4">
            <div>
              <p className="p-4 text-xl">
                Ready to take control of your tasks and boost your productivity?
                <br />
                Sign up for our todo app today and start organizing your tasks
                like a pro. <br />
                With a user-friendly interface and seamless user experience,
                you'll wonder how you ever managed without it.
              </p>
            </div>
            <div>
              <img
                src="../public/index-2.jpg"
                alt=""
                height="400px"
                width="400px"
              />
            </div>
          </div>
          <div className="flex-wrap flex justify-center items-center m-4">
            <Button>Signup</Button>
            <Button>Login</Button>
          </div>
        </div>
      </>
    );
  }
  else
  {
    return (
      <>User</>
    )
  }
}

export default Home;
