import React, { useState } from "react";
import axiosClient from "../../utils/axiosClient";
import ENDPOINTS from "../../utils/endpoints";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import FoodBackground from "../../components/ui/FoodBackground";
import Input from "../../components/ui/Input";
import PasswordInput from "../../components/ui/PasswordInput";

const FoodPartnerRegister = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    contactName: "",
  });

  // controlled inputs: update form state on change

  const handleChange = (e) => {
    setForm((f) => ({
      ...f,
      [e.target.name]: e.target.value,
    }));
  };

  // basic validation

  const validate = () => {
    if (!form.fullName.trim()) return "Full name is required.";

    if (!form.contactName.trim()) return "Contact name is required.";

    if (!form.email.includes("@")) return "Enter a valid email.";

    if (form.password.length < 4)
      return "Password must be at least 4 characters long.";

    // simple phone check: numbers only, length 7-15

    const phoneClean = form.phone.replace(/\D/g, "");

    if (!phoneClean || phoneClean.length < 7 || phoneClean.length > 15)
      return "Enter a valid number (7-15 digits)";

    if (!form.address.trim()) return "Address is required";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validate();

    if (error) {
      toast.error(error);
      return;
    }

    try {
      setLoading(true);

      const res = await axiosClient.post(ENDPOINTS.FOOD_PARTNER_REGISTER, {
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        address: form.address,
        phone: form.phone,
        contactName: form.contactName,
      });

      toast.success(
        res.data?.message || "Food partner registered successfully"
      );

      // redirect to partner login after short delay

      setTimeout(() => {
        navigate("/food-partner/login");
      }, 900);
    } catch (error) {
      console.log(
        "Partner register error: ",
        error.response?.data || error.message || error
      );

      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FoodBackground>
      {/* Outer flex centers the card both vertically and horizontally */}

      <div className="flex items-center justify-center min-h-screen p-4">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-xl bg-white rounded-2xl p-6 shadow-md border border-gray-100 space-y-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Title area */}
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-800 mb-5">
              Partner Sign Up
            </h1>
            <p className="text-sm text-gray-500">
              Register your food business with us
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* full name */}

            <Input
              label="Business / Owner name"
              name="fullName"
              placeholder="e.g., Garima's Kitchen"
              value={form.fullName}
              onChange={handleChange}
            />

            <Input
              label="Contact Name"
              name="contactName"
              placeholder="e.g., Garima GSJ"
              value={form.contactName}
              onChange={handleChange}
            />

            {/* Phone */}

            <Input
              label="Phone"
              name="phone"
              placeholder="+1234567890"
              value={form.phone}
              onChange={handleChange}
            />

            {/* Email */}

            <Input
              label="Email"
              name="email"
              type="email"
              placeholder="partner@example.com"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          {/* Address - full row */}

          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700">Address</label>
            <textarea
              name="address"
              rows={2}
              placeholder="Street, City, State, Zip"
              value={form.address}
              onChange={handleChange}
              className="w-full p-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Password - full row */}

          <PasswordInput
            label="Password"
            name="password"
            placeholder="*******"
            value={form.password}
            onChange={handleChange}
          />

          {/* Submit */}

          <button
            type="submit"
            className="w-full p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium cursor-pointer"
          >
            {loading ? "Registering..." : "Register as Partner"}
          </button>

          {/* small text */}

          <p className="text-center text-gray-500 text-sm">
            Already have a partner account?{" "}
            <span
              onClick={() => navigate("/food-partner/login")}
              className="text-green-600 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </FoodBackground>
  );
};

export default FoodPartnerRegister;
