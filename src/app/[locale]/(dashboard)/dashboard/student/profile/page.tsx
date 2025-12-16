'use client';

import { useEffect, useState } from 'react';
import { studentService } from '@/services/mock/studentService';
import { User } from '@/services/mock/mockData';
import FadeIn from '@/components/ui/FadeIn';
import { User as UserIcon, Heart, Phone, Save, CheckCircle } from 'lucide-react';

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'personal' | 'medical' | 'emergency'>('personal');
    const [saving, setSaving] = useState(false);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            // Fetch exemplary student to show filled data
            // In a real app, this would be the current user
            const userData = MOCK_USERS.find(u => u.id === 'student-exemplary');
            setUser(userData || null);
            setLoading(false);
        };
        loadData();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
        setSaving(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
    };

    if (loading) return <div className="p-8">Loading profile...</div>;

    // Mock data for the form if user is null (shouldn't happen with mock data)
    const medical = user?.medicalInfo || { allergies: [], bloodType: '', medications: '', emergencyContact: { name: '', phone: '', relation: '' } };

    return (
        <div className="space-y-8 relative">
            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-in slide-in-from-top-5 duration-300">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-bold">Profile updated successfully!</span>
                </div>
            )}

            <FadeIn>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-primary mb-2">My Profile</h1>
                        <p className="text-slate-500">Manage your personal and medical information.</p>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="btn btn-primary flex items-center gap-2"
                    >
                        {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
                    </button>
                </div>
            </FadeIn>

            <div className="grid md:grid-cols-4 gap-8">
                {/* Sidebar Navigation */}
                <FadeIn delay={0.1}>
                    <div className="md:col-span-1 space-y-2">
                        <button
                            onClick={() => setActiveTab('personal')}
                            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'personal' ? 'bg-white shadow-sm text-primary font-bold border border-slate-100' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <UserIcon className="w-5 h-5" /> Personal Info
                        </button>
                        <button
                            onClick={() => setActiveTab('medical')}
                            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'medical' ? 'bg-white shadow-sm text-primary font-bold border border-slate-100' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <Heart className="w-5 h-5" /> Medical Record
                        </button>
                        <button
                            onClick={() => setActiveTab('emergency')}
                            className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'emergency' ? 'bg-white shadow-sm text-primary font-bold border border-slate-100' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <Phone className="w-5 h-5" /> Emergency Contacts
                        </button>
                    </div>
                </FadeIn>

                {/* Form Content */}
                <div className="md:col-span-3">
                    <form onSubmit={handleSave}>
                        {activeTab === 'personal' && (
                            <FadeIn>
                                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 space-y-6">
                                    <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">Personal Information</h2>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">Full Name</label>
                                            <input type="text" defaultValue={user?.name} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">Email</label>
                                            <input type="email" defaultValue={user?.email} className="w-full px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-500" disabled />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">Passport Number</label>
                                            <input type="text" placeholder="A12345678" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">Passport Expiry</label>
                                            <input type="date" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">T-Shirt Size</label>
                                            <select className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none">
                                                <option>Small</option>
                                                <option>Medium</option>
                                                <option>Large</option>
                                                <option>X-Large</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>
                        )}

                        {activeTab === 'medical' && (
                            <FadeIn>
                                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 space-y-6">
                                    <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                                        <h2 className="text-xl font-bold text-slate-800">Medical Record</h2>
                                        <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-full uppercase">Critical</span>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">Blood Type</label>
                                            <select defaultValue={medical.bloodType} className="w-full md:w-1/3 px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none">
                                                <option value="">Select...</option>
                                                <option value="A+">A+</option>
                                                <option value="A-">A-</option>
                                                <option value="B+">B+</option>
                                                <option value="B-">B-</option>
                                                <option value="O+">O+</option>
                                                <option value="O-">O-</option>
                                                <option value="AB+">AB+</option>
                                                <option value="AB-">AB-</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">Allergies</label>
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {medical.allergies?.map((allergy, i) => (
                                                    <span key={i} className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                                                        {allergy} <button type="button" className="hover:text-orange-900">×</button>
                                                    </span>
                                                ))}
                                            </div>
                                            <input type="text" placeholder="Type and press Enter to add..." className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none" />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">Current Medications</label>
                                            <textarea defaultValue={medical.medications} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none h-24" placeholder="List any medications you are currently taking..."></textarea>
                                        </div>

                                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                                            <h3 className="font-bold text-blue-800 mb-2">Private Medical Insurance</h3>
                                            <p className="text-sm text-blue-600 mb-4">Please upload your insurance policy if you have one.</p>
                                            <button type="button" className="btn bg-white text-blue-600 border border-blue-200 hover:bg-blue-50 text-sm py-2">Upload Policy PDF</button>
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>
                        )}

                        {activeTab === 'emergency' && (
                            <FadeIn>
                                <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 space-y-6">
                                    <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">Emergency Contacts</h2>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">Contact Name</label>
                                            <input type="text" defaultValue={medical.emergencyContact?.name} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">Relationship</label>
                                            <input type="text" defaultValue={medical.emergencyContact?.relation} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">Phone Number</label>
                                            <input type="tel" defaultValue={medical.emergencyContact?.phone} className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-slate-700">Alternative Phone</label>
                                            <input type="tel" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-primary outline-none" />
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

// Helper to access mock users directly for this demo page
import { MOCK_USERS } from '@/services/mock/mockData';
