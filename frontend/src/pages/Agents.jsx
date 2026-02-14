import React, { useEffect, useState } from 'react';
import { fetchAgents, createAgent, updateAgent, deleteAgent } from '../api';

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentDescription, setNewAgentDescription] = useState('');
  const [newAgentRole, setNewAgentRole] = useState('general');
  const [editingAgentId, setEditingAgentId] = useState(null);
  const [editingAgentName, setEditingAgentName] = useState('');
  const [editingAgentDescription, setEditingAgentDescription] = useState('');
  const [editingAgentRole, setEditingAgentRole] = useState('general');

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = async () => {
    const data = await fetchAgents();
    setAgents(data);
  };

  const handleCreate = async () => {
    if (!newAgentName.trim()) return;
    await createAgent({ name: newAgentName, description: newAgentDescription, role: newAgentRole });
    setNewAgentName('');
    setNewAgentDescription('');
    setNewAgentRole('general');
    loadAgents();
  };

  const handleEdit = (agent) => {
    setEditingAgentId(agent._id);
    setEditingAgentName(agent.name);
    setEditingAgentDescription(agent.description);
    setEditingAgentRole(agent.role);
  };

  const handleUpdate = async () => {
    if (!editingAgentName.trim()) return;
    await updateAgent(editingAgentId, { name: editingAgentName, description: editingAgentDescription, role: editingAgentRole });
    setEditingAgentId(null);
    setEditingAgentName('');
    setEditingAgentDescription('');
    setEditingAgentRole('general');
    loadAgents();
  };

  const handleDelete = async (id) => {
    await deleteAgent(id);
    loadAgents();
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg">
      <h1 className="text-2xl font-bold mb-4 pl-12 md:pl-0">AI Agents Management</h1>
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="text"
          placeholder="Agent Name"
          value={newAgentName}
          onChange={(e) => setNewAgentName(e.target.value)}
          className="p-2 rounded bg-gray-800 border border-gray-700"
        />
        <input
          type="text"
          placeholder="Agent Description"
          value={newAgentDescription}
          onChange={(e) => setNewAgentDescription(e.target.value)}
          className="p-2 rounded bg-gray-800 border border-gray-700"
        />
        <select
          value={newAgentRole}
          onChange={(e) => setNewAgentRole(e.target.value)}
          className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
        >
          <option value="sales">Sales</option>
          <option value="technical_support">Technical Support</option>
          <option value="general">General</option>
          <option value="billing">Billing</option>
          <option value="other">Other</option>
        </select>
        <button
          onClick={handleCreate}
          className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700"
        >
          Create Agent
        </button>
      </div>
      <table className="w-full text-left border-collapse border border-gray-700">
        <thead>
          <tr>
            <th className="border border-gray-600 px-4 py-2">Name</th>
            <th className="border border-gray-600 px-4 py-2">Role</th>
            <th className="border border-gray-600 px-4 py-2">Description</th>
            <th className="border border-gray-600 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr key={agent._id}>
              <td className="border border-gray-600 px-4 py-2">
                {editingAgentId === agent._id ? (
                  <input
                    type="text"
                    value={editingAgentName}
                    onChange={(e) => setEditingAgentName(e.target.value)}
                    className="p-1 rounded bg-gray-800 border border-gray-700"
                  />
                ) : (
                  agent.name
                )}
              </td>
              <td className="border border-gray-600 px-4 py-2">
                {editingAgentId === agent._id ? (
                  <select
                    value={editingAgentRole}
                    onChange={(e) => setEditingAgentRole(e.target.value)}
                    className="p-1 rounded bg-gray-800 border border-gray-700 text-white"
                  >
                    <option value="sales">Sales</option>
                    <option value="technical_support">Technical Support</option>
                    <option value="general">General</option>
                    <option value="billing">Billing</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  agent.role
                )}
              </td>
              <td className="border border-gray-600 px-4 py-2">
                {editingAgentId === agent._id ? (
                  <input
                    type="text"
                    value={editingAgentDescription}
                    onChange={(e) => setEditingAgentDescription(e.target.value)}
                    className="p-1 rounded bg-gray-800 border border-gray-700"
                  />
                ) : (
                  agent.description
                )}
              </td>
              <td className="border border-gray-600 px-4 py-2">
                {editingAgentId === agent._id ? (
                  <>
                    <button
                      onClick={handleUpdate}
                      className="mr-2 bg-green-600 px-2 py-1 rounded hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingAgentId(null)}
                      className="bg-gray-600 px-2 py-1 rounded hover:bg-gray-700"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(agent)}
                      className="mr-2 bg-blue-600 px-2 py-1 rounded hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(agent._id)}
                      className="bg-red-600 px-2 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Agents;
