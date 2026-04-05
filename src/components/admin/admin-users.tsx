"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/lib/trpc";

export function AdminUsers() {
  return (
    <div className="space-y-8">
      <InviteCodes />
      <UsersList />
    </div>
  );
}

function InviteCodes() {
  const [role, setRole] = useState<"ADMIN" | "EDITOR">("EDITOR");
  const [expiresInHours, setExpiresInHours] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const utils = api.useUtils();
  const { data: inviteCodes, isLoading } = api.users.listInviteCodes.useQuery();

  const createMutation = api.users.createInviteCode.useMutation({
    onSuccess: () => utils.users.listInviteCodes.invalidate(),
  });

  const revokeMutation = api.users.revokeInviteCode.useMutation({
    onSuccess: () => utils.users.listInviteCodes.invalidate(),
  });

  const handleCreate = () => {
    createMutation.mutate({
      role,
      expiresInHours: expiresInHours ? Number(expiresInHours) : undefined,
    });
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatus = (invite: {
    usedById: string | null;
    revoked: boolean;
    expiresAt: string | Date | null;
  }) => {
    if (invite.usedById) return { label: "Used", color: "bg-gray-100 text-gray-600" };
    if (invite.revoked) return { label: "Revoked", color: "bg-red-100 text-red-600" };
    if (invite.expiresAt && new Date(invite.expiresAt) < new Date())
      return { label: "Expired", color: "bg-yellow-100 text-yellow-700" };
    return { label: "Active", color: "bg-green-100 text-green-700" };
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Invite Codes</h2>

      {/* Create form */}
      <div className="flex flex-wrap items-end gap-3 mb-6 pb-6 border-b border-gray-100">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as "ADMIN" | "EDITOR")}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm
                       focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
          >
            <option value="EDITOR">Editor</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Expires in (hours, optional)
          </label>
          <input
            type="number"
            value={expiresInHours}
            onChange={(e) => setExpiresInHours(e.target.value)}
            placeholder="No expiry"
            className="w-36 px-3 py-2 border border-gray-200 rounded-xl text-sm
                       focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
          />
        </div>
        <button
          onClick={handleCreate}
          disabled={createMutation.isPending}
          className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-xl
                     hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {createMutation.isPending ? "Creating..." : "Generate Code"}
        </button>
      </div>

      {/* List */}
      {isLoading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : !inviteCodes?.length ? (
        <p className="text-sm text-gray-500">No invite codes yet.</p>
      ) : (
        <div className="space-y-2">
          {inviteCodes.map((invite) => {
            const status = getStatus(invite);
            return (
              <div
                key={invite.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <code className="text-sm font-mono font-bold text-gray-900">
                    {invite.code}
                  </code>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${status.color}`}
                  >
                    {status.label}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                    {invite.role}
                  </span>
                  {invite.usedBy && (
                    <span className="text-xs text-gray-500">
                      used by {invite.usedBy.name ?? invite.usedBy.email}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {!invite.usedById && !invite.revoked && (
                    <>
                      <button
                        onClick={() => copyCode(invite.code, invite.id)}
                        className="px-2 py-1 text-xs text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        {copiedId === invite.id ? "Copied!" : "Copy"}
                      </button>
                      <button
                        onClick={() => revokeMutation.mutate({ id: invite.id })}
                        disabled={revokeMutation.isPending}
                        className="px-2 py-1 text-xs text-red-600 hover:text-red-800 transition-colors"
                      >
                        Revoke
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function UsersList() {
  const { data: session } = useSession();
  const utils = api.useUtils();
  const { data: users, isLoading } = api.users.listUsers.useQuery();

  const updateRoleMutation = api.users.updateUserRole.useMutation({
    onSuccess: () => utils.users.listUsers.invalidate(),
  });

  const removeMutation = api.users.removeUser.useMutation({
    onSuccess: () => utils.users.listUsers.invalidate(),
  });

  const handleRemove = (userId: string, name: string | null) => {
    if (!confirm(`Remove ${name ?? "this user"}? This will revoke their access.`)) return;
    removeMutation.mutate({ userId });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Users</h2>

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : !users?.length ? (
        <p className="text-sm text-gray-500">No users found.</p>
      ) : (
        <div className="space-y-2">
          {users.map((user) => {
            const isSelf = user.id === session?.user?.id;
            return (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  {user.image && (
                    <img
                      src={user.image}
                      alt=""
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.name ?? "Unnamed"}
                      {isSelf && (
                        <span className="ml-1 text-xs text-gray-400">(you)</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={user.role}
                    onChange={(e) =>
                      updateRoleMutation.mutate({
                        userId: user.id,
                        role: e.target.value as "ADMIN" | "EDITOR",
                      })
                    }
                    disabled={isSelf || updateRoleMutation.isPending}
                    className="px-2 py-1 text-sm border border-gray-200 rounded-lg
                               focus:border-green-500 focus:outline-none
                               disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="EDITOR">Editor</option>
                  </select>
                  <button
                    onClick={() => handleRemove(user.id, user.name)}
                    disabled={isSelf || removeMutation.isPending}
                    className="px-2 py-1 text-xs text-red-600 hover:text-red-800
                               disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
