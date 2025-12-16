"use client";

import React, { useState } from 'react';
import { MOCK_CONTACTS, Contact, Note, Priority } from '@/services/mock/mockData';
import { BadgeCheck, AlertCircle, Clock, Plus, User, Building, Mail, AlertTriangle } from 'lucide-react';

export default function CrmPage() {
    const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
    const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

    // Form states
    const [noteContent, setNoteContent] = useState('');
    const [notePriority, setNotePriority] = useState<Priority>('normal');

    const selectedContact = contacts.find(c => c.id === selectedContactId);

    const handleAddNote = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedContact || !noteContent.trim()) return;

        const newNote: Note = {
            id: `note-${Date.now()}`,
            content: noteContent,
            type: 'internal_note',
            priority: notePriority,
            createdAt: new Date().toISOString(),
            author: 'Admin User' // Hardcoded as per spec context
        };

        const updatedContacts = contacts.map(contact => {
            if (contact.id === selectedContact.id) {
                const updatedTimeline = [newNote, ...contact.timeline];
                let updatedHealth = contact.healthStatus;

                // Logic: If critical note, set health to red
                if (notePriority === 'critical') {
                    updatedHealth = 'red';
                }

                return {
                    ...contact,
                    timeline: updatedTimeline,
                    healthStatus: updatedHealth
                };
            }
            return contact;
        });

        setContacts(updatedContacts);
        setNoteContent('');
        setNotePriority('normal');
    };

    const getHealthColor = (status: string) => {
        switch (status) {
            case 'red': return 'bg-red-100 text-red-800 border-red-200';
            case 'yellow': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'green': return 'bg-green-100 text-green-800 border-green-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityBadge = (priority: Priority) => {
        switch (priority) {
            case 'critical': return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">CRÍTICO</span>;
            case 'high': return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">Atención</span>;
            default: return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">Normal</span>;
        }
    };

    return (
        <div className="flex h-[calc(100vh-100px)] gap-6 p-6 bg-gray-50">
            {/* LEFT PANEL: LIST */}
            <div className="w-3/5 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-lg font-semibold text-gray-800">Contactos</h2>
                </div>
                <div className="overflow-y-auto flex-1">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="px-4 py-3">Nombre</th>
                                <th className="px-4 py-3">Organización</th>
                                <th className="px-4 py-3">Estatus</th>
                                <th className="px-4 py-3">Salud</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {contacts.map(contact => (
                                <tr
                                    key={contact.id}
                                    onClick={() => setSelectedContactId(contact.id)}
                                    className={`
                                        cursor-pointer hover:bg-blue-50 transition-colors
                                        ${selectedContactId === contact.id ? 'bg-blue-50' : ''}
                                        ${contact.healthStatus === 'red' ? 'border-l-4 border-red-500' : 'border-l-4 border-transparent'}
                                    `}
                                >
                                    <td className="px-4 py-3 font-medium text-gray-900">
                                        {contact.internalId && <div className="text-xs font-bold text-primary font-mono mb-0.5">{contact.internalId}</div>}
                                        <div>{contact.name}</div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{contact.organization}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                            ${contact.status === 'enrolled' ? 'bg-green-100 text-green-800' :
                                                contact.status === 'applied' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'}`}>
                                            {contact.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className={`w-3 h-3 rounded-full ${contact.healthStatus === 'red' ? 'bg-red-500' :
                                            contact.healthStatus === 'yellow' ? 'bg-yellow-500' :
                                                'bg-green-500'
                                            }`} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* RIGHT PANEL: DETAIL */}
            <div className="w-2/5 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                {selectedContact ? (
                    <>
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 bg-gray-50/30">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">{selectedContact.name}</h2>
                                    {selectedContact.internalId && (
                                        <span className="text-xs font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded inline-block mt-1">
                                            ID: {selectedContact.internalId}
                                        </span>
                                    )}
                                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                                        <Mail className="w-4 h-4" />
                                        {selectedContact.email}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                                        <Building className="w-4 h-4" />
                                        {selectedContact.organization}
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getHealthColor(selectedContact.healthStatus)}`}>
                                    Health: {selectedContact.healthStatus.toUpperCase()}
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600 uppercase tracking-wide font-semibold">{selectedContact.role}</span>
                                <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">Interest: {selectedContact.programInterest}</span>
                            </div>
                        </div>

                        {/* Timeline & Notes */}
                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                            <div className="space-y-6">
                                {/* Add Note Form */}
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <Plus className="w-4 h-4" /> Agregar Nota
                                    </h3>
                                    <form onSubmit={handleAddNote} className="space-y-3">
                                        <textarea
                                            value={noteContent}
                                            onChange={(e) => setNoteContent(e.target.value)}
                                            placeholder="Escribe una nota..."
                                            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none h-24"
                                            required
                                        />
                                        <div className="flex justify-between items-center">
                                            <select
                                                value={notePriority}
                                                onChange={(e) => setNotePriority(e.target.value as Priority)}
                                                className="text-sm border border-gray-300 rounded-md p-1.5 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                            >
                                                <option value="normal">Normal</option>
                                                <option value="high">Atención</option>
                                                <option value="critical">CRÍTICO</option>
                                            </select>
                                            <button
                                                type="submit"
                                                className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                                            >
                                                Guardar Nota
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* Timeline */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Historial</h3>
                                    {selectedContact.timeline.length === 0 ? (
                                        <p className="text-sm text-gray-400 italic text-center py-4">No hay notas registradas.</p>
                                    ) : (
                                        selectedContact.timeline.map((note) => (
                                            <div key={note.id} className="relative pl-4 border-l-2 border-gray-200 pb-4 last:pb-0">
                                                <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-gray-300 ring-4 ring-white" />
                                                <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm ml-2">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs font-bold text-gray-700">{note.author}</span>
                                                            {getPriorityBadge(note.priority)}
                                                        </div>
                                                        <span className="text-xs text-gray-400 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(note.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                        <User className="w-16 h-16 mb-4 opacity-20" />
                        <p className="text-lg font-medium">Selecciona un contacto</p>
                        <p className="text-sm">Haz click en la lista de la izquierda para ver detalles.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
