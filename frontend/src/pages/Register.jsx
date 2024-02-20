import React, { useState } from "react";
import Input from "../components/Input";
import { useForm } from "react-hook-form";
import { GiArchiveRegister } from "react-icons/gi";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import Button from "../components/Button";
import { ErrorMessage } from "@hookform/error-message";
import axios from "axios";

function Register() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  const [viewPassword, setViewPassword] = useState("password");
  const [registerError, setRegisterError] = useState("");

  const toggleViewPassword = () => {
    if (viewPassword === "password") {
      setViewPassword("text");
    } else {
      setViewPassword("password");
    }
  };

  const registerhandler = async (data, e) => {
    const formData = new FormData();
    // console.log(data)
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    const file = data.profilePhoto[0];
    if (
      !(
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png"
      )
    ) {
      setError("profilePhoto", {
        type: "filetype",
        message: "Only JPEG, JPG and PNG are valid.",
      });
      return;
    }
    formData.append("profilePhoto", file);
    // console.log(data)
    //console.log(formData)
    await axios
      .post("http://localhost:8000/api/v1/users/register", formData)
      .then((response) => {
        // console.log(response.data);
        
      })
      .catch((error) => {
        if (error.response) {
          setRegisterError(error.response.data.message);
        } else {
          setRegisterError(error.message);
        }
      });
  };
  return (
    <>
      <div className="w-full bg-red-500">
        <p className="text-white text-center">{registerError}</p>
      </div>
      <form
        onSubmit={handleSubmit(registerhandler)}
        className="flex flex-col flex-wrap justify-center items-center m-4 p-4"
      >
        <div className="flex justify-center items-center gap-2 text-2xl underline">
          <GiArchiveRegister /> Register Here
        </div>
        <div className="w-2/4 px-2">
          <Input
            label="Name"
            placeholder="Full Name"
            name="fullName"
            {...register("fullName", {
              required: "Name required",
              maxLength: { value: 20, message: "Max-length allowed 20" },
            })}
          />
          <ErrorMessage
            errors={errors}
            name="fullName"
            render={({ message }) =>
              message && <p className="text-red-300 text-xs">{message}</p>
            }
          />
        </div>
        <div className="w-2/4 px-2">
          <Input
            label="Email"
            placeholder="Email Address"
            name="email"
            {...register("email", {
              required: "Email required",
              pattern: {
                value:
                  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: "Invalid Email",
              },
            })}
          />
          <ErrorMessage
            errors={errors}
            name="email"
            render={({ message }) =>
              message && <p className="text-red-300 text-xs">{message}</p>
            }
          />
        </div>
        <div className="w-2/4 px-2 flex flex-col">
          <div className="flex items-center gap-2">
            <Input
              label="Password"
              placeholder="Password"
              name="password"
              type={viewPassword}
              {...register("password", { required: "Password required" })}
            />
            <NavLink to="#" onClick={toggleViewPassword} className="text-2xl">
              {viewPassword === "password" ? <FaEye /> : <FaEyeSlash />}
            </NavLink>
          </div>
          <ErrorMessage
            errors={errors}
            name="password"
            render={({ message }) =>
              message && <p className="text-red-300 text-xs">{message}</p>
            }
          />
        </div>
        <div className="w-2/4 px-2">
          <Input
            label="Profile-Photo"
            placeholder="Profile Photo"
            name="profilePhoto"
            type="file"
            accept="image/jpeg, image/png, image/jpg"
            {...register("profilePhoto", {
              required: "Profile photo required",
            })}
          />
          <ErrorMessage
            errors={errors}
            name="profilePhoto"
            render={({ message }) =>
              message && <p className="text-red-300 text-xs">{message}</p>
            }
          />
        </div>
        <Button type="submit">Register</Button>
      </form>
    </>
  );
}

export default Register;
