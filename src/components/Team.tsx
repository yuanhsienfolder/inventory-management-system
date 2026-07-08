import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import "./Team.scss";

type Member = {
  id: number;
  email: string;
  role: string;
  status: string;
};

export default function Team() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("staff");
  const [currentUserEmail, setCurrentUserEmail] = useState("");

  useEffect(() => {
    fetchMembers();
    fetchCurrentUser();
  }, []);

  async function fetchCurrentUser() {
    const { data } = await supabase.auth.getUser();
    setCurrentUserEmail(data.user?.email ?? "");
  }

  async function fetchMembers() {
    setLoading(true);
    const { data, error } = await supabase.from("team_members").select();

    if (error) {
      console.error("Error fetching team:", error);
      setLoading(false);
      return;
    }

    setMembers(data ?? []);
    setLoading(false);
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;

    const { data, error } = await supabase
      .from("team_members")
      .insert([{ email: inviteEmail, role: inviteRole, status: "invited", invited_by: userId }])
      .select();

    if (error) {
      console.error("Error inviting member:", error);
      return;
    }

    if (data) {
      setMembers([...members, data[0]]);
      setInviteEmail("");
      setInviteRole("staff");
    }
  }

  async function handleRemove(id: number) {
    const { error } = await supabase.from("team_members").delete().eq("id", id);

    if (error) {
      console.error("Error removing member:", error);
      return;
    }

    setMembers(members.filter((m) => m.id !== id));
  }

  return (
    <div className="team">
      <h2>Team</h2>
      <p className="team__subtitle">
        Members of your workspace. New members activate when they sign up with the invited email.
      </p>

      <div className="invite-box">
        <h3>Invite teammate</h3>
        <form onSubmit={handleInvite}>
          <input
            type="email"
            placeholder="teammate@company.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
            <option value="viewer">Viewer</option>
          </select>
          <button type="submit" className="btn-primary">+ Send Invite</button>
        </form>
        <div className="role-legend">
          <span><strong>Admin</strong>: full access + team</span>
          <span><strong>Staff</strong>: edit items & POs</span>
          <span><strong>Viewer</strong>: read-only</span>
        </div>
      </div>

      <div className="team-list">
        {loading ? (
          <div className="loading-state">Loading team...</div>
        ) : (
          <table className="team-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{currentUserEmail} (you)</td>
                <td>Admin</td>
                <td><span className="badge badge--success">Active</span></td>
                <td></td>
              </tr>
              {members.map((member) => (
                <tr key={member.id}>
                  <td>{member.email}</td>
                  <td className="capitalize">{member.role}</td>
                  <td>
                    <span className={`badge badge--${member.status === "active" ? "success" : "warning"}`}>
                      {member.status}
                    </span>
                  </td>
                  <td>
                    <button className="remove-btn" onClick={() => handleRemove(member.id)}>✕</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}