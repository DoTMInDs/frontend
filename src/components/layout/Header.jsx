import React from 'react';
import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  Button,
} from "flowbite-react";
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../Config';
import { FiLogIn } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <Navbar fluid rounded className="bg-white dark:bg-gray-900 shadow-md py-2 px-4 sticky top-0 z-50">
      {/* Brand/Logo */}
      <NavbarBrand as={Link} to="/" className="flex items-center gap-2">
        {/* Replace with your logo if desired */}
        <span className="text-2xl font-bold text-green-600">🌱</span>
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Farm-Connect</span>
      </NavbarBrand>
      {/* Hamburger for mobile */}
      <NavbarToggle />
      {/* Center nav links */}
      <NavbarCollapse className="mx-auto">
        <NavbarLink as={Link} to="/" className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400">Home</NavbarLink>
        {user && (
          <NavbarLink as={Link} to="/product" className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400">My Products</NavbarLink>
        )}
        <NavbarLink as={Link} to="/shop" className="text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400">Shop</NavbarLink>
      </NavbarCollapse>
      {/* User actions */}
      <div className="flex items-center gap-2">
        {user ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User settings"
                img={user.photoURL || undefined}
                rounded
                size="sm"
                className="ring-2 ring-green-500"
              />
            }
          >
            <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
              <div className="font-semibold">{user.displayName || user.email}</div>
            </div>
            <DropdownDivider />
            <DropdownItem onClick={() => navigate('/profile')}>Profile</DropdownItem>
            <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
          </Dropdown>
        ) : (
          <>
            <Button as={Link} to="/login" color="light" className="px-4 py-1 text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-900 flex items-center gap-2">
              <FiLogIn className="text-lg" /> Login
            </Button>
          </>
        )}
      </div>
    </Navbar>
  );
};

export default Header;