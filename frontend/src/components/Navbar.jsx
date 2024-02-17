import React from "react";
import { navbarLinks } from "../restApi";
import { NavLink } from "react-router-dom";
import { FcTodoList } from "react-icons/fc";
import { CiMenuFries } from "react-icons/ci";
import { IoClose } from "react-icons/io5";

const Navbar = () => {
  const handleOpenClick = () => {
    const list = document.querySelector(".unordered-list");
    list.style.right = 0;
  };
  const handleCloseClick = () => {
    const list = document.querySelector(".unordered-list");
    list.style.right = "-300px";
  };
  return (
    <>
      <nav className="navbar">
        <div className="navbar-body">
          <div className="logo">
            <FcTodoList />
          </div>
          <div className="links">
            <ul className="unordered-list">
              <li className="close-option list-item">
                <a onClick={handleCloseClick}>
                  <IoClose />
                </a>
              </li>
              {navbarLinks.map((eachLink) => (
                <li className="list-item" key={eachLink.id}>
                  <NavLink
                    to={eachLink.link}
                    className={({ isActive }) => `${isActive ? "show" : ""}`}
                  >
                    {eachLink.title}
                  </NavLink>
                </li>
              ))}
            </ul>
            <div>
              <a className="menu-option" onClick={handleOpenClick}>
                <CiMenuFries />
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
