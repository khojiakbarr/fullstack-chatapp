import { Mail, Lock, AtSign, Loader2, EyeOff, Eye } from "lucide-react";
import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const ForgotPass = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    code: "",
    password: "",
  });

  const {
    isSended,
    isSending,
    isHasBeenSent,
    isCheked,
    isAgain,
    sendCodeToEmail,
    sendCode,
    sendPassword,
  } = useAuthStore();

  const againSendCode = async () => {
     await sendCodeToEmail({ email: formData.email });
    toast.success("Code has been sent to your email");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isCheked)
      await sendPassword({ password: formData.password, code: formData.code });
    if (!formData.email.trim()) return;
    if (!isSended) await sendCodeToEmail({ email: formData.email });
    if (isHasBeenSent) sendCode({ code: formData.code, email: formData.email });
  };

  return (
    <div className="h-screen grid">
      <div className="flex flex-col justify-center items-center p-6 sm:p-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-base-content/40" />
              </div>
              <input
                type="email"
                className={`input input-bordered w-full pl-10`}
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={isSending || isHasBeenSent || isCheked}
                required
              />
            </div>
          </div>
          {/* password */}
          {isCheked && (
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered w-full pl-10`}
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  minLength={6}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>
          )}
          {/* code */}
          {isHasBeenSent && (
            <div className="form-control">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AtSign className="h-5 w-5 text-base-content/40" />
                </div>

                <input
                  type="text"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="email code"
                  maxLength={4}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isSending}
          >
            {isSending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Loading...
              </>
            ) : isHasBeenSent ? (
              "Check"
            ) : isCheked ? (
              "Submit"
            ) : (
              "Send code"
            )}
          </button>
          {isAgain && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={againSendCode}
                className="underline"
              >
                send again code
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgotPass;
