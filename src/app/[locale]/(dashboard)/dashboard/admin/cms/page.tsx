"use client";

import React, { useState } from 'react';
import { MOCK_PROGRAMS, Program } from '@/services/mock/mockData';
import { Plus, Edit, ArrowLeft, ExternalLink, Trash2 } from 'lucide-react';

type Tab = 'general' | 'finance' | 'itinerary' | 'flights' | 'preview';

export default function CmsPage() {
    const [programs, setPrograms] = useState<Program[]>(MOCK_PROGRAMS);
    const [view, setView] = useState<'list' | 'edit'>('list');
    const [editingProgram, setEditingProgram] = useState<Program | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>('general');

    const handleNewProgram = () => {
        const newProgram: Program = {
            id: `prog-${Date.now()}`,
            title: '',
            slug: '',
            destination: '',
            price: 0,
            currency: 'USD',
            status: 'draft',
            itinerary: [],
            flights: [],
            inclusions: []
        };
        setEditingProgram(newProgram);
        setView('edit');
        setActiveTab('general');
    };

    const handleEditProgram = (program: Program) => {
        setEditingProgram({ ...program }); // Clone to avoid direct mutation
        setView('edit');
        setActiveTab('general');
    };

    const handleSave = () => {
        if (!editingProgram) return;

        const updatedPrograms = programs.some(p => p.id === editingProgram.id)
            ? programs.map(p => p.id === editingProgram.id ? editingProgram : p)
            : [...programs, editingProgram];

        setPrograms(updatedPrograms);
        setView('list');
        setEditingProgram(null);
    };

    const updateField = (field: keyof Program, value: any) => {
        if (!editingProgram) return;
        setEditingProgram({ ...editingProgram, [field]: value });
    };

    const addItineraryDay = () => {
        if (!editingProgram) return;
        const newDay = {
            day: editingProgram.itinerary.length + 1,
            title: '',
            description: ''
        };
        setEditingProgram({
            ...editingProgram,
            itinerary: [...editingProgram.itinerary, newDay]
        });
    };

    const updateItineraryDay = (index: number, field: 'title' | 'description', value: string) => {
        if (!editingProgram) return;
        const newItinerary = [...editingProgram.itinerary];
        newItinerary[index] = { ...newItinerary[index], [field]: value };
        setEditingProgram({ ...editingProgram, itinerary: newItinerary });
    };

    const removeItineraryDay = (index: number) => {
        if (!editingProgram) return;
        const newItinerary = editingProgram.itinerary.filter((_, i) => i !== index)
            .map((day, i) => ({ ...day, day: i + 1 })); // Re-index days
        setEditingProgram({ ...editingProgram, itinerary: newItinerary });
    };

    if (view === 'list') {
        return (
            <div className="p-8 max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Constructor de Viajes</h1>
                    <button
                        onClick={handleNewProgram}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        <Plus className="w-4 h-4" /> Nuevo Viaje
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium text-sm">
                            <tr>
                                <th className="px-6 py-4">ID Interno</th>
                                <th className="px-6 py-4">Título del Programa</th>
                                <th className="px-6 py-4">Destino</th>
                                <th className="px-6 py-4">Precio</th>
                                <th className="px-6 py-4">Estatus</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {programs.map(program => (
                                <tr key={program.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs font-bold text-primary">
                                        {program.internalId || '-'}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-900">{program.title}</td>
                                    <td className="px-6 py-4 text-gray-600">{program.destination}</td>
                                    <td className="px-6 py-4 text-gray-600">{program.price.toLocaleString()} {program.currency}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                            ${program.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {program.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleEditProgram(program)}
                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm inline-flex items-center gap-1"
                                        >
                                            <Edit className="w-4 h-4" /> Editar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => setView('list')}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">
                    {editingProgram?.id.startsWith('prog-') && !programs.some(p => p.id === editingProgram.id) ? 'Nuevo Viaje' : 'Editar Viaje'}
                </h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Tabs Header */}
                <div className="flex border-b border-gray-200 bg-gray-50">
                    {(['general', 'finance', 'itinerary', 'flights', 'preview'] as Tab[]).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 text-sm font-medium capitalize border-b-2 transition-colors
                                ${activeTab === tab
                                    ? 'border-blue-600 text-blue-600 bg-white'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tabs Content */}
                <div className="p-8 min-h-[400px]">
                    {activeTab === 'general' && editingProgram && (
                        <div className="space-y-6 max-w-2xl">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Título del Programa</label>
                                <input
                                    type="text"
                                    value={editingProgram.title}
                                    onChange={(e) => updateField('title', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                                <input
                                    type="text"
                                    value={editingProgram.slug}
                                    onChange={(e) => updateField('slug', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Destino</label>
                                <input
                                    type="text"
                                    value={editingProgram.destination}
                                    onChange={(e) => updateField('destination', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Estatus</label>
                                <select
                                    value={editingProgram.status}
                                    onChange={(e) => updateField('status', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                >
                                    <option value="draft">Borrador</option>
                                    <option value="published">Publicado</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {activeTab === 'finance' && editingProgram && (
                        <div className="space-y-6 max-w-xl">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Precio Público</label>
                                <input
                                    type="number"
                                    value={editingProgram.price}
                                    onChange={(e) => updateField('price', Number(e.target.value))}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Moneda</label>
                                <select
                                    value={editingProgram.currency}
                                    onChange={(e) => updateField('currency', e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                >
                                    <option value="USD">USD - Dólar Americano</option>
                                    <option value="MXN">MXN - Peso Mexicano</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {activeTab === 'itinerary' && editingProgram && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium text-gray-900">Itinerario Día por Día</h3>
                                <button
                                    onClick={addItineraryDay}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" /> Agregar Día
                                </button>
                            </div>

                            <div className="space-y-4">
                                {editingProgram.itinerary.map((day, index) => (
                                    <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative group">
                                        <button
                                            onClick={() => removeItineraryDay(index)}
                                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <div className="grid grid-cols-12 gap-4">
                                            <div className="col-span-1 pt-2">
                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-sm">
                                                    {day.day}
                                                </span>
                                            </div>
                                            <div className="col-span-11 space-y-3">
                                                <input
                                                    type="text"
                                                    placeholder="Título del día (ej. Llegada a Londres)"
                                                    value={day.title}
                                                    onChange={(e) => updateItineraryDay(index, 'title', e.target.value)}
                                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                                                />
                                                <textarea
                                                    placeholder="Descripción de actividades..."
                                                    value={day.description}
                                                    onChange={(e) => updateItineraryDay(index, 'description', e.target.value)}
                                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm h-20 resize-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {editingProgram.itinerary.length === 0 && (
                                    <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                                        No hay días agregados al itinerario.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'flights' && editingProgram && (
                        <div className="space-y-8">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium text-gray-900">Información de Vuelos</h3>
                                <button
                                    onClick={() => {
                                        const newFlight = {
                                            id: `flight-${Date.now()}`,
                                            airline: '',
                                            flightNumber: '',
                                            departureTime: '',
                                            arrivalTime: '',
                                            departureAirport: '',
                                            arrivalAirport: '',
                                            terminal: '',
                                            type: 'outbound' as const,
                                            category: '',
                                            seats: '',
                                            notes: '',
                                            cancellationPolicy: ''
                                        };
                                        setEditingProgram({
                                            ...editingProgram,
                                            flights: [...(editingProgram.flights || []), newFlight]
                                        });
                                    }}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" /> Agregar Vuelo
                                </button>
                            </div>

                            {(!editingProgram.flights || editingProgram.flights.length === 0) && (
                                <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                                    No hay vuelos registrados para este programa.
                                </div>
                            )}

                            {(editingProgram.flights || []).map((flight, index) => (
                                <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200 relative">
                                    <button
                                        onClick={() => {
                                            const newFlights = editingProgram.flights!.filter((_, i) => i !== index); // Use ! assertion since we are mapping over it
                                            setEditingProgram({ ...editingProgram, flights: newFlights });
                                        }}
                                        className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Aerolínea</label>
                                            <input
                                                type="text"
                                                value={flight.airline}
                                                onChange={(e) => {
                                                    const newFlights = [...editingProgram.flights!];
                                                    newFlights[index] = { ...flight, airline: e.target.value };
                                                    setEditingProgram({ ...editingProgram, flights: newFlights });
                                                }}
                                                className="w-full p-2 border border-gray-300 rounded text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">No. Vuelo</label>
                                            <input
                                                type="text"
                                                value={flight.flightNumber}
                                                onChange={(e) => {
                                                    const newFlights = [...editingProgram.flights!];
                                                    newFlights[index] = { ...flight, flightNumber: e.target.value };
                                                    setEditingProgram({ ...editingProgram, flights: newFlights });
                                                }}
                                                className="w-full p-2 border border-gray-300 rounded text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Tipo</label>
                                            <select
                                                value={flight.type}
                                                onChange={(e) => {
                                                    const newFlights = [...editingProgram.flights!];
                                                    newFlights[index] = { ...flight, type: e.target.value as 'outbound' | 'return' };
                                                    setEditingProgram({ ...editingProgram, flights: newFlights });
                                                }}
                                                className="w-full p-2 border border-gray-300 rounded text-sm bg-white"
                                            >
                                                <option value="outbound">Ida (Outbound)</option>
                                                <option value="return">Regreso (Return)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Categoría/Clase</label>
                                            <input
                                                type="text"
                                                value={flight.category || ''}
                                                onChange={(e) => {
                                                    const newFlights = [...editingProgram.flights!];
                                                    newFlights[index] = { ...flight, category: e.target.value };
                                                    setEditingProgram({ ...editingProgram, flights: newFlights });
                                                }}
                                                placeholder="Ej. Economy"
                                                className="w-full p-2 border border-gray-300 rounded text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-4 gap-4 mb-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Origen (IATA)</label>
                                            <input
                                                type="text"
                                                value={flight.departureAirport}
                                                onChange={(e) => {
                                                    const newFlights = [...editingProgram.flights!];
                                                    newFlights[index] = { ...flight, departureAirport: e.target.value };
                                                    setEditingProgram({ ...editingProgram, flights: newFlights });
                                                }}
                                                placeholder="Ej. MEX"
                                                className="w-full p-2 border border-gray-300 rounded text-sm font-mono uppercase"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Destino (IATA)</label>
                                            <input
                                                type="text"
                                                value={flight.arrivalAirport}
                                                onChange={(e) => {
                                                    const newFlights = [...editingProgram.flights!];
                                                    newFlights[index] = { ...flight, arrivalAirport: e.target.value };
                                                    setEditingProgram({ ...editingProgram, flights: newFlights });
                                                }}
                                                placeholder="Ej. LHR"
                                                className="w-full p-2 border border-gray-300 rounded text-sm font-mono uppercase"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Fecha/Hora Salida</label>
                                            <input
                                                type="datetime-local"
                                                value={flight.departureTime}
                                                onChange={(e) => {
                                                    const newFlights = [...editingProgram.flights!];
                                                    newFlights[index] = { ...flight, departureTime: e.target.value };
                                                    setEditingProgram({ ...editingProgram, flights: newFlights });
                                                }}
                                                className="w-full p-2 border border-gray-300 rounded text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-4 gap-4 mb-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Terminal</label>
                                            <input
                                                type="text"
                                                value={flight.terminal}
                                                onChange={(e) => {
                                                    const newFlights = [...editingProgram.flights!];
                                                    newFlights[index] = { ...flight, terminal: e.target.value };
                                                    setEditingProgram({ ...editingProgram, flights: newFlights });
                                                }}
                                                className="w-full p-2 border border-gray-300 rounded text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Fecha/Hora Llegada</label>
                                            <input
                                                type="datetime-local"
                                                value={flight.arrivalTime}
                                                onChange={(e) => {
                                                    const newFlights = [...editingProgram.flights!];
                                                    newFlights[index] = { ...flight, arrivalTime: e.target.value };
                                                    setEditingProgram({ ...editingProgram, flights: newFlights });
                                                }}
                                                className="w-full p-2 border border-gray-300 rounded text-sm"
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Asientos</label>
                                            <input
                                                type="text"
                                                value={flight.seats || ''}
                                                onChange={(e) => {
                                                    const newFlights = [...editingProgram.flights!];
                                                    newFlights[index] = { ...flight, seats: e.target.value };
                                                    setEditingProgram({ ...editingProgram, flights: newFlights });
                                                }}
                                                placeholder="Ej. Bloque Grupal o 12A"
                                                className="w-full p-2 border border-gray-300 rounded text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Notas del Vuelo</label>
                                            <textarea
                                                value={flight.notes || ''}
                                                onChange={(e) => {
                                                    const newFlights = [...editingProgram.flights!];
                                                    newFlights[index] = { ...flight, notes: e.target.value };
                                                    setEditingProgram({ ...editingProgram, flights: newFlights });
                                                }}
                                                className="w-full p-2 border border-gray-300 rounded text-sm resize-none h-16"
                                                placeholder="Instrucciones especiales..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 mb-1">Políticas de Cancelación</label>
                                            <textarea
                                                value={flight.cancellationPolicy || ''}
                                                onChange={(e) => {
                                                    const newFlights = [...editingProgram.flights!];
                                                    newFlights[index] = { ...flight, cancellationPolicy: e.target.value };
                                                    setEditingProgram({ ...editingProgram, flights: newFlights });
                                                }}
                                                className="w-full p-2 border border-gray-300 rounded text-sm resize-none h-16"
                                                placeholder="Detalles sobre cambios y cancelaciones..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'preview' && editingProgram && (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <ExternalLink className="w-16 h-16 text-gray-300" />
                            <h3 className="text-lg font-medium text-gray-900">Vista Previa</h3>
                            <p className="text-gray-500 text-center max-w-md">
                                Haz click en el botón para ver cómo se verá la página generada para este viaje.
                            </p>
                            <button
                                onClick={() => window.open(`/programs/${editingProgram.slug}`, '_blank')}
                                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
                            >
                                <ExternalLink className="w-4 h-4" /> Ver Página Generada
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
                    <button
                        onClick={() => setView('list')}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm shadow-sm"
                    >
                        Guardar Cambios
                    </button>
                </div>
            </div>
        </div>
    );
}
