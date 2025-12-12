import React from "react";
import axiosClient from "../../utils/axiosClient";
import ENDPOINTS from "../../utils/endpoints";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Input from "../../components/ui/Input";
import FoodBackground from "../../components/ui/FoodBackground";

const UserRegister = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  // handle user typing

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Validation

  const validate = () => {
    if (!form.firstName.trim()) return "First name required";
    if (!form.lastName.trim()) return "Last name required";

    if (!form.email.includes("@")) return "Enter valid email";
    if (form.password.length < 4)
      return "Password must be at least 4 characters long";

    return null;
  };

  // Submit registration

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validate();

    if (error) return toast.error(error);

    const fullName = `${form.firstName} ${form.lastName}`;

    try {
      setLoading(true);

      const res = await axiosClient.post(ENDPOINTS.USER_REGISTER, {
        ...form,
        fullName,
      });

      toast.success("Registration successful");

      setTimeout(() => {
        navigate("/user/login");
      }, 1500);

      console.log("User regsiter: ", res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");

      console.log("User register error: ", error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FoodBackground>
      <div className="flex justify-center items-center min-h-screen p-4">
        {/* Form wrapper box */}

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white rounded-2xl p-6 shadow-md border border-gray-100 space-y-4"
        >
          {/* Title */}

          <h1 className="text-2xl font-semibold text-gray-800 text-center">
            Create an Account
          </h1>

          <p className="text-gray-500 text-center text-sm">
            Join the community of food lovers!🍕🍔
          </p>

          {/* First name  */}

          <div className="flex gap-4">
            <Input
              label="First Name"
              name="firstName"
              placeholder="John"
              value={form.firstName}
              onChange={handleChange}
            />

            <Input
              label="Last Name"
              name="lastName"
              placeholder="Doe"
              value={form.lastName}
              onChange={handleChange}
            />
          </div>

          <Input
            label="Email"
            name="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="*******"
            value={form.password}
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Registerin..." : "Register"}
          </button>

          {/* Inline login text */}

          <p className="text-center text-gray-500 text-sm">
            Already have an account?{"  "}
            <span
              onClick={() => navigate("/user/login")}
              className="text-indigo-600 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </FoodBackground>
  );
};

export default UserRegister;
