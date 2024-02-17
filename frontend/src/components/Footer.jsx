import React from "react";
import { FcTodoList } from "react-icons/fc";
import {
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaFacebook,
  FaCopyright,
} from "react-icons/fa";

function Footer() {
  return (
    <>
      <div className="footer">
        <div className="logo">
          <FcTodoList />
        </div>
        <div className="right-side">
          <div>
            <h2>My Todo App</h2>
            <p>
              My Todo App is a simple and intuitive tool designed to help you
              organize your tasks and stay productive.
            </p>
            <p>
              Whether you're managing personal projects or collaborating with a
              team, our app makes it easy to create, prioritize, and track your
              todos.
            </p>
          </div>
          <div className="icons">
            <FaInstagram />
            <FaFacebook />
            <FaLinkedin />
            <FaTwitter />
          </div>
          <div className="copyright">
            <FaCopyright />
            <p>Copyrights reserved.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
