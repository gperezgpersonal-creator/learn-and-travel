'use client';

import React, { useState, useEffect } from 'react';
import styles from './QuoteHistory.module.css';
import { QuoteService, QuoteVersion } from '@/services/supabase/quoteService';

interface QuoteHistoryProps {
    onLoadVersion: (version: QuoteVersion) => void;
}

export default function QuoteHistory({ onLoadVersion }: QuoteHistoryProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [versions, setVersions] = useState<QuoteVersion[]>([]);
    const [loading, setLoading] = useState(true);

    const loadVersions = async () => {
        setLoading(true);
        const data = await QuoteService.getVersions();
        setVersions(data);
        setLoading(false);
    };

    useEffect(() => {
        loadVersions();
    }, []);

    const filteredVersions = versions.filter(v => {
        const search = searchTerm.toLowerCase();
        const code = (v.programCode || '').toLowerCase();
        const name = (v.name || '').toLowerCase();
        const city = (v.city || v.data?.headerInfo?.ciudadPrograma || '').toLowerCase();
        const client = (v.clientName || '').toLowerCase();

        return code.includes(search) || name.includes(search) || city.includes(search) || client.includes(search);
    });

    const formatMoney = (v: number) => {
        if (!isFinite(v)) return "$0.00";
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);
    };

    const handleDelete = async (id: string) => {
        if (confirm("¿Estás seguro de eliminar esta versión?")) {
            await QuoteService.deleteVersion(id);
            await loadVersions();
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Historial de Cotizaciones</h2>
                <div className={styles.searchBox}>
                    <input
                        type="text"
                        placeholder="Buscar por código, nombre o ciudad..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Código</th>
                            <th>Versión</th>
                            <th>Ciudad</th>
                            <th>Fechas</th>
                            <th>Precio DBL</th>
                            <th style={{ width: '30%' }}>Incluye</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVersions.length === 0 && (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', padding: '30px' }}>
                                    No se encontraron cotizaciones.
                                </td>
                            </tr>
                        )}
                        {filteredVersions.map(v => (
                            <tr key={v.id}>
                                <td className={styles.code}>{v.programCode}</td>
                                <td>
                                    <div className={styles.vName}>{v.name}</div>
                                    <div className={styles.date}>{new Date(v.timestamp).toLocaleDateString()} {new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                </td>
                                <td>{v.city || (v.data?.headerInfo?.ciudadPrograma) || '-'}</td>
                                <td>{v.dates || (v.data?.headerInfo?.fechasPrograma) || '-'}</td>
                                <td className={styles.price}>
                                    {v.priceDbl ? formatMoney(v.priceDbl) : (v.data?.results?.dbl ? formatMoney(v.data.results.dbl) : '-')}
                                </td>
                                <td className={styles.summary}>{v.summary || 'Sin resumen'}</td>
                                <td>
                                    <div className={styles.actions}>
                                        <button className={styles.btnLoad} onClick={() => onLoadVersion(v)}>Cargar</button>
                                        <button className={styles.btnDelete} onClick={() => handleDelete(v.id)}>🗑</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
