'use client';

import { useEffect, useState } from 'react';
import { studentService } from '@/services/mock/studentService';
import { Trip, Flight, Accommodation, Activity, Program } from '@/services/mock/mockData';
import FadeIn from '@/components/ui/FadeIn';
import { Calendar, Plane, Home, MapPin, Clock, User } from 'lucide-react';

export default function TripsPage() {
    const [activeTab, setActiveTab] = useState<'itinerary' | 'flights' | 'accommodation'>('itinerary');
    const [trip, setTrip] = useState<Trip | null>(null);
    const [program, setProgram] = useState<Program | null>(null);
    const [flights, setFlights] = useState<Flight[]>([]);
    const [accommodation, setAccommodation] = useState<Accommodation | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            const tripData = await studentService.getTrip('trip-london');
            const programData = tripData?.programId ? await studentService.getProgram(tripData.programId) : null;
            const flightsData = await studentService.getFlights('trip-london');
            const accData = await studentService.getAccommodation('trip-london');

            setTrip(tripData);
            setProgram(programData);
            setFlights(flightsData);
            setAccommodation(accData);
            setLoading(false);
        };
        loadData();
    }, []);

    if (loading) return <div className="p-8">Loading trip details...</div>;

    return (
        <div className="space-y-8">
            <FadeIn>
                <div className="relative h-48 rounded-xl overflow-hidden mb-8">
                    <img src={trip?.image} alt={trip?.destination} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-end p-8">
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-white mb-1">{trip?.title}</h1>
                            {trip?.internalId && (
                                <div className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md mb-2 border border-white/30">
                                    ID: {trip.internalId}
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-white/90">
                                <MapPin className="w-4 h-4" />
                                <span>{trip?.destination}</span>
                                <span className="mx-2">•</span>
                                <Calendar className="w-4 h-4" />
                                <span>{trip?.startDate} - {trip?.endDate}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </FadeIn>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-6">
                <button
                    onClick={() => setActiveTab('itinerary')}
                    className={`px-6 py-3 font-bold text-sm transition-colors border-b-2 ${activeTab === 'itinerary' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Itinerary
                </button>
                <button
                    onClick={() => setActiveTab('flights')}
                    className={`px-6 py-3 font-bold text-sm transition-colors border-b-2 ${activeTab === 'flights' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Flights
                </button>
                <button
                    onClick={() => setActiveTab('accommodation')}
                    className={`px-6 py-3 font-bold text-sm transition-colors border-b-2 ${activeTab === 'accommodation' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                >
                    Accommodation
                </button>
            </div>

            {/* Content */}
            <div className="min-h-[400px]">
                {activeTab === 'itinerary' && (
                    <div className="space-y-6">
                        {program?.itinerary?.map((day, index) => (
                            <FadeIn key={index} delay={index * 0.1}>
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm z-10">
                                            {day.day}
                                        </div>
                                        <div className="w-px h-full bg-slate-200 -mt-2"></div>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex-1 mb-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="font-bold text-slate-800">{day.title}</h3>
                                        </div>
                                        <p className="text-slate-600 text-sm whitespace-pre-wrap">{day.description}</p>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                        {(!program?.itinerary || program.itinerary.length === 0) && (
                            <div className="text-center py-12 text-slate-400">
                                No itinerary details available yet.
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'flights' && (
                    <div className="space-y-6">
                        {flights.map((flight, index) => (
                            <FadeIn key={flight.id} delay={index * 0.1}>
                                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                                    <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <Plane className="w-5 h-5 text-slate-400" />
                                            <span className="font-bold text-slate-700">{flight.airline}</span>
                                        </div>
                                        <span className="text-sm font-mono text-slate-500">{flight.flightNumber}</span>
                                    </div>
                                    <div className="p-6 grid grid-cols-3 gap-8 items-center">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-slate-800">{flight.departureAirport}</div>
                                            <div className="text-sm text-slate-500">{new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                            <div className="text-xs text-slate-400 mt-1">{new Date(flight.departureTime).toLocaleDateString()}</div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className="w-full h-px bg-slate-300 relative">
                                                <Plane className="w-4 h-4 text-slate-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-90" />
                                            </div>
                                            <div className="text-xs text-slate-400 mt-2">Direct Flight</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-slate-800">{flight.arrivalAirport}</div>
                                            <div className="text-sm text-slate-500">{new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                            <div className="text-xs text-slate-400 mt-1">{new Date(flight.arrivalTime).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-slate-400 block text-xs uppercase font-bold">Terminal</span>
                                            <span className="text-slate-700 font-medium">{flight.terminal}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400 block text-xs uppercase font-bold">Type</span>
                                            <span className="text-slate-700 font-medium capitalize">{flight.type}</span>
                                        </div>
                                        {flight.category && (
                                            <div>
                                                <span className="text-slate-400 block text-xs uppercase font-bold">Class</span>
                                                <span className="text-slate-700 font-medium">{flight.category}</span>
                                            </div>
                                        )}
                                        {flight.seats && (
                                            <div>
                                                <span className="text-slate-400 block text-xs uppercase font-bold">Seat(s)</span>
                                                <span className="text-slate-700 font-medium">{flight.seats}</span>
                                            </div>
                                        )}
                                        {flight.notes && (
                                            <div className="col-span-2 mt-2 pt-2 border-t border-slate-200">
                                                <span className="text-slate-400 block text-xs uppercase font-bold mb-1">Notes</span>
                                                <p className="text-slate-600">{flight.notes}</p>
                                            </div>
                                        )}
                                        {flight.cancellationPolicy && (
                                            <div className="col-span-2 pt-2 border-t border-slate-200">
                                                <span className="text-slate-400 block text-xs uppercase font-bold mb-1">Cancellation Policy</span>
                                                <p className="text-slate-600 text-xs">{flight.cancellationPolicy}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                )}

                {activeTab === 'accommodation' && accommodation && (
                    <FadeIn>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-6 border-b border-slate-100">
                                <div className="flex items-start gap-4">
                                    <div className="bg-orange-50 p-3 rounded-lg text-orange-600">
                                        <Home className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-xl text-slate-800">{accommodation.name}</h3>
                                        <p className="text-slate-500">{accommodation.address}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <h4 className="font-bold text-sm text-slate-700 uppercase mb-2">Details</h4>
                                    <p className="text-slate-600">{accommodation.details}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold text-sm text-slate-700 uppercase mb-2">Contact</h4>
                                    <p className="text-slate-600">{accommodation.contactPhone}</p>
                                </div>
                                {accommodation.roommate && (
                                    <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-3">
                                        <User className="w-5 h-5 text-blue-600" />
                                        <div>
                                            <div className="text-xs text-blue-600 font-bold uppercase">Roommate</div>
                                            <div className="font-bold text-slate-800">{accommodation.roommate}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </FadeIn>
                )}
            </div>
        </div>
    );
}
