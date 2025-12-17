import { useState } from "react";
import { useAuth } from "../context/useAuth";
import { useUpdateProfile } from "../hooks/useUpdateProfile";
import { User, Mail, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Profile() {
  const { user, setUser } = useAuth();
  const updateProfile = useUpdateProfile();
    const navigate = useNavigate();

  const [name, setName] = useState(user?.name ?? "");

  if (!user) return null;

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const updatedUser = await updateProfile.mutateAsync({ name });
  setUser(updatedUser);

  toast.success("Profile updated successfully");
setTimeout(() => navigate("/"), 800);


  navigate("/"); // 👈 redirect to dashboard
};


  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50/60 to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
       <div className="mb-2">
  <button
    onClick={() => navigate(-1)}
    className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 mb-2 transition"
  >
    ← Back
  </button>

  <h1 className="text-xl font-semibold text-gray-900">
    Profile Settings
  </h1>
  <p className="text-sm text-gray-500 mt-1">
    Manage your personal information and account details
  </p>
</div>


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Profile Summary */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
                <User className="w-8 h-8 text-indigo-600" />
              </div>

              <h2 className="text-lg font-semibold text-gray-900">
                {user.name}
              </h2>
              <p className="text-sm text-gray-500">{user.email}</p>

              <div className="mt-4 inline-flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                <ShieldCheck className="w-4 h-4" />
                Secure Account
              </div>
            </div>
          </div>

          {/* Right: Editable Form */}
          <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-5">
              Personal Information
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={user.email}
                    disabled
                    className="w-full pl-10 pr-3 py-2.5 rounded-lg border bg-gray-100 text-gray-500 text-sm"
                  />
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Display Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={updateProfile.isPending}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60 transition"
                >
                  {updateProfile.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
