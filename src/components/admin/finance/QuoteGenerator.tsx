'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './QuoteGenerator.module.css';
import { QuoteService } from '@/services/supabase/quoteService';

interface Auxiliar {
    id: number;
    description: string;
    value: string; // Changed to string for easier editing
}

interface QuoteGeneratorProps {
    initialData?: any;
    onClearInitialData?: () => void;
}

export default function QuoteGenerator({ initialData, onClearInitialData }: QuoteGeneratorProps) {
    // 1. State for all inputs
    // Header Info
    const [headerInfo, setHeaderInfo] = useState({
        numeroPrograma: '',
        fechasPrograma: '',
        ciudadPrograma: '',
        profesorResponsable: ''
    });

    // General Parameters - Store as Strings to allow empty " " while editing
    const [params, setParams] = useState({
        minParticipantes: '10',
        participantesEsperados: '20',
        noches: '5',
        diasTotales: '6',
        personasAgencia: '1',
        incluyeTransporteAeropuerto: true,
        incluyeTransporteVisitas: true,
        incluyeAlimentos: true,
        contingenciaSingles: true,
    });

    // Costs & Details - Store as Strings
    const [costs, setCosts] = useState({
        costoHabitacion: '120',
        hotelConsiderado: '',
        costoVuelo: '500',
        vueloSalida: '',
        vueloRegreso: '',
        viaticosAgencia: '100',
        viaticosProfesor: '0',
        diasTranspAeropuerto: '1',
        transpAeropuertoPP: '10',
        diasTranspVisitas: '3',
        transpVisitasPP: '15',
        costoAlimento: '12',
        cantidadAlimentos: '4',
        costoSeguro: '40',
        feeParticipante: '500',
        comisionBancaria: '0.04',
        factorSingles: '1',
    });

    // Auxiliaries
    const [auxiliaries, setAuxiliaries] = useState<Auxiliar[]>(
        Array.from({ length: 5 }, (_, i) => ({ id: i + 1, description: '', value: '' }))
    );

    // Financing
    const [numPagos, setNumPagos] = useState('3');
    const [observaciones, setObservaciones] = useState('');

    // Calculated Results
    const [results, setResults] = useState({
        sgl: 0, dbl: 0, tpl: 0, quad: 0,
        finSgl: 0, finDbl: 0, finTpl: 0, finQuad: 0,
        pagoSgl: 0, pagoDbl: 0, pagoTpl: 0, pagoQuad: 0,
        cfPP: 0, cvComPP: 0
    });

    // Load initial data if provided from History
    useEffect(() => {
        if (initialData) {
            if (initialData.headerInfo) setHeaderInfo(initialData.headerInfo);
            if (initialData.params) setParams(initialData.params);
            if (initialData.costs) setCosts(initialData.costs);
            if (initialData.auxiliaries) setAuxiliaries(initialData.auxiliaries);
            if (initialData.numPagos) setNumPagos(initialData.numPagos);
            if (initialData.observaciones) setObservaciones(initialData.observaciones);

            // Clean up prop to avoid re-setting on every header change if parent doesn't clear it
            if (onClearInitialData) onClearInitialData();
        }
    }, [initialData, onClearInitialData]);


    // Helper functions
    const formatMoney = (v: number) => {
        if (!isFinite(v)) return "$0.00";
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(v);
    };

    const num = (val: string) => {
        const parsed = parseFloat(val);
        return isNaN(parsed) ? 0 : parsed;
    };

    // Calculation Logic (matches original script)
    useEffect(() => {
        const minPart = Math.max(1, num(params.minParticipantes));
        const noches = num(params.noches);
        const diasTotales = num(params.diasTotales);

        const cVuelo = num(costs.costoVuelo);
        const cHab = num(costs.costoHabitacion);
        const vAgencia = num(costs.viaticosAgencia);
        const vProf = num(costs.viaticosProfesor);

        // Fixed Costs Calculation
        const C_ag = num(params.personasAgencia) * (cVuelo + noches * cHab + diasTotales * vAgencia);
        const C_prof = (cVuelo + noches * cHab + diasTotales * vProf);
        const C_fix = 0;
        const CF_pp = (C_ag + C_prof + C_fix) / minPart;

        // Variable Costs
        let transporteAer_pp = 0;
        if (params.incluyeTransporteAeropuerto) transporteAer_pp = num(costs.diasTranspAeropuerto) * num(costs.transpAeropuertoPP);

        let transporteVis_pp = 0;
        if (params.incluyeTransporteVisitas) transporteVis_pp = num(costs.diasTranspVisitas) * num(costs.transpVisitasPP);

        let alimentos_pp = 0;
        if (params.incluyeAlimentos) alimentos_pp = num(costs.costoAlimento) * num(costs.cantidadAlimentos);

        let aux_pp = auxiliaries.reduce((sum, aux) => sum + (num(aux.value)), 0);

        const fee = num(costs.feeParticipante);
        const seg = num(costs.costoSeguro);

        const CVcom_pp = cVuelo + seg + fee + aux_pp + transporteAer_pp + transporteVis_pp + alimentos_pp;

        let SC_pp = 0;
        if (params.contingenciaSingles) {
            SC_pp = (num(costs.factorSingles) * noches * cHab) / minPart;
        }

        // Calculate per occupancy
        const calcOcupacion = (occ: number) => {
            const CH_pp = (noches * cHab) / (occ || 1);
            const K_pp = CF_pp + CVcom_pp + CH_pp + SC_pp;
            // Apply bank commission (price / (1 - commission))
            const com = num(costs.comisionBancaria);
            const P_pp = (1 - com) !== 0 ? K_pp / (1 - com) : K_pp;
            return P_pp;
        };

        const sgl = calcOcupacion(1);
        const dbl = calcOcupacion(2);
        const tpl = calcOcupacion(3);
        const quad = calcOcupacion(4);

        // Financing (+5%)
        const pagos = Math.max(1, num(numPagos));
        const fin = (val: number) => val * 1.05;

        setResults({
            sgl, dbl, tpl, quad,
            finSgl: fin(sgl), finDbl: fin(dbl), finTpl: fin(tpl), finQuad: fin(quad),
            pagoSgl: fin(sgl) / pagos, pagoDbl: fin(dbl) / pagos, pagoTpl: fin(tpl) / pagos, pagoQuad: fin(quad) / pagos,
            cfPP: CF_pp, cvComPP: CVcom_pp
        });

    }, [params, costs, auxiliaries, numPagos]);

    // Handle Input Changes
    const handleHeader = (e: React.ChangeEvent<HTMLInputElement>) => setHeaderInfo({ ...headerInfo, [e.target.id]: e.target.value });

    const handleParam = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.type === 'checkbox') {
            setParams({ ...params, [e.target.id]: e.target.checked });
        } else {
            setParams({ ...params, [e.target.id]: e.target.value });
        }
    };

    const handleCost = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCosts({ ...costs, [e.target.id]: e.target.value });
    };

    const handleAux = (id: number, field: 'description' | 'value', val: string) => {
        setAuxiliaries(prev => prev.map(a => a.id === id ? { ...a, [field]: val } : a));
    };

    // Save as HTML Logic
    const saveAsHtml = () => {
        window.print();
    };

    // --- Version Control Logic ---
    const [showSaveModal, setShowSaveModal] = useState(false);
    const [versionName, setVersionName] = useState('');

    const generateSummary = () => {
        let text = 'Incluye: Vuelo, Hospedaje, Seguro, Fee';
        if (params.incluyeTransporteAeropuerto) text += ', Transporte Aeropuerto';
        if (params.incluyeTransporteVisitas) text += ', Transporte Visitas';
        if (params.incluyeAlimentos) text += ', Alimentos';
        if (params.contingenciaSingles) text += ', Contingencia Singles';

        const activeAux = auxiliaries.filter(a => a.value && num(a.value) > 0);
        if (activeAux.length > 0) {
            text += '. Además: ' + activeAux.map(a => a.description).join(', ');
        }

        return text + '.';
    };

    const handleSaveVersion = async () => {
        if (!versionName) return alert("Escribe un nombre para la versión");

        // Validate required fields
        if (!headerInfo.numeroPrograma) {
            alert("Debes ingresar un Número de Programa antes de guardar.");
            return;
        }

        // Construct full state object
        const fullState = {
            headerInfo,
            params,
            costs,
            auxiliaries,
            numPagos,
            observaciones
        };

        const saved = await QuoteService.saveVersion(
            versionName,
            headerInfo.numeroPrograma,
            headerInfo.ciudadPrograma,
            headerInfo.fechasPrograma,
            fullState,
            results.sgl,
            results.dbl, // Passing Double Occupancy Price
            generateSummary() // Passing Summary String
        );

        if (saved) {
            setShowSaveModal(false);
            setVersionName('');
            alert("Versión guardada correctamente en la nube.");
        } else {
            alert("Error al guardar la versión. Intenta de nuevo.");
        }
    };

    return (
        <div className={styles.container}>
            {/* Save Modal */}
            {showSaveModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalCard}>
                        <h3>Guardar Versión</h3>
                        <p className={styles.modalSub}>Se guardará con el ID: <strong>{headerInfo.numeroPrograma || 'Sin ID'}</strong></p>

                        <div className={styles.inputGroup}>
                            <label>Nombre de la versión</label>
                            <input
                                type="text"
                                placeholder="Ej. Opción 1 con Disney"
                                autoFocus
                                value={versionName}
                                onChange={(e) => setVersionName(e.target.value)}
                            />
                        </div>

                        <div className={styles.modalActions}>
                            <button className={styles.btnOutline} onClick={() => setShowSaveModal(false)}>Cancelar</button>
                            <button className={styles.btnPrimary} onClick={handleSaveVersion}>Guardar</button>
                        </div>
                    </div>
                </div>
            )}

            <div className={styles.page}>
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <p className={styles.headerTitle}>Cotizador de programa</p>
                        <p className={styles.headerSub}>Modelo de costeo con mínimo de participantes, fee, comisión y ocupación.</p>
                        <p className={styles.headerNote}>Solo para uso interno</p>
                    </div>
                    <div className={`${styles.headerActions} no-print`}>
                        <button className={styles.btnPrimary} type="button" onClick={() => setShowSaveModal(true)} style={{ marginRight: '10px' }}>
                            💾 Guardar
                        </button>
                        <button className={styles.btn} type="button" onClick={saveAsHtml}>
                            Imprimir PDF
                        </button>
                    </div>
                </div>

                {/* ID Card */}
                <div className={styles.idCard}>
                    <div>
                        <label>Número de programa</label>
                        <input type="text" id="numeroPrograma" placeholder="Ej. LT-070-2025" value={headerInfo.numeroPrograma} onChange={handleHeader} />
                    </div>
                    <div>
                        <label>Fechas del programa</label>
                        <input type="text" id="fechasPrograma" placeholder="Ej. 5-10 nov 2025" value={headerInfo.fechasPrograma} onChange={handleHeader} />
                    </div>
                    <div>
                        <label>Ciudad del programa</label>
                        <input type="text" id="ciudadPrograma" placeholder="Ej. Miami, FL" value={headerInfo.ciudadPrograma} onChange={handleHeader} />
                    </div>
                    <div>
                        <label>Profesor responsable</label>
                        <input type="text" id="profesorResponsable" placeholder="Nombre" value={headerInfo.profesorResponsable} onChange={handleHeader} />
                    </div>
                </div>

                <div className={styles.layout}>
                    {/* Left Column: Inputs */}
                    <div className="left">
                        {/* Parameters Card */}
                        <div className={styles.card}>
                            <p className={styles.cardTitle}>Parámetros generales</p>
                            <div className={styles.grid}>
                                <div>
                                    <div className={styles.field}>
                                        <label>Mínimo participantes</label>
                                        <input className={styles.input} type="number" id="minParticipantes" value={params.minParticipantes} onChange={handleParam} min={1} />
                                    </div>
                                    <div className={styles.field}>
                                        <label>Participantes esperados</label>
                                        <input className={styles.input} type="number" id="participantesEsperados" value={params.participantesEsperados} onChange={handleParam} min={1} />
                                    </div>
                                    <div className={styles.fieldInline}>
                                        <div>
                                            <label>Noches</label>
                                            <input className={styles.input} type="number" id="noches" value={params.noches} onChange={handleParam} min={1} />
                                        </div>
                                        <div>
                                            <label>Días totales</label>
                                            <input className={styles.input} type="number" id="diasTotales" value={params.diasTotales} onChange={handleParam} min={1} />
                                        </div>
                                    </div>
                                    <div className={styles.field}>
                                        <label>Staff Agencia</label>
                                        <input className={styles.input} type="number" id="personasAgencia" value={params.personasAgencia} onChange={handleParam} min={0} />
                                    </div>
                                </div>
                                <div>
                                    <div className={styles.checkboxRow}>
                                        <input
                                            type="checkbox"
                                            id="incluyeTransporteAeropuerto"
                                            checked={params.incluyeTransporteAeropuerto as boolean}
                                            onChange={handleParam}
                                        />
                                        <label htmlFor="incluyeTransporteAeropuerto">Transporte aeropuerto</label>
                                    </div>
                                    <div className={styles.checkboxRow}>
                                        <input
                                            type="checkbox"
                                            id="incluyeTransporteVisitas"
                                            checked={params.incluyeTransporteVisitas as boolean}
                                            onChange={handleParam}
                                        />
                                        <label htmlFor="incluyeTransporteVisitas">Transporte visitas</label>
                                    </div>
                                    <div className={styles.checkboxRow}>
                                        <input
                                            type="checkbox"
                                            id="incluyeAlimentos"
                                            checked={params.incluyeAlimentos as boolean}
                                            onChange={handleParam}
                                        />
                                        <label htmlFor="incluyeAlimentos">Incluir alimentos <span className={styles.tag}>activa número de alimentos</span></label>
                                    </div>
                                    <div className={styles.checkboxRow}>
                                        <input
                                            type="checkbox"
                                            id="contingenciaSingles"
                                            checked={params.contingenciaSingles as boolean}
                                            onChange={handleParam}
                                        />
                                        <label htmlFor="contingenciaSingles">Contingenc. Singles</label>
                                    </div>
                                    <p className={styles.hint}>
                                        Contingencia singles (factor) normalmente se deja en 1. Esto significa que, si el grupo requiere
                                        habitaciones sencillas adicionales, el costo de una habitación sencilla se reparte entre el mínimo de participantes.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Costs Card */}
                        <div className={`${styles.card} mt-4`}>
                            <p className={styles.cardTitle}>Costos por persona y día</p>
                            <div className={styles.grid}>
                                {/* Basic Costs */}
                                <div className={styles.field}>
                                    <label>Habitación / noche (Full)</label>
                                    <div className={styles.moneyInput}>
                                        <span className={styles.moneySymbol}>$</span>
                                        <input type="number" id="costoHabitacion" value={costs.costoHabitacion} onChange={handleCost} />
                                    </div>
                                </div>
                                <div className={styles.field}>
                                    <label>Vuelo pp</label>
                                    <div className={styles.moneyInput}>
                                        <span className={styles.moneySymbol}>$</span>
                                        <input type="number" id="costoVuelo" value={costs.costoVuelo} onChange={handleCost} />
                                    </div>
                                </div>

                                {/* Operational Costs */}
                                <div className={styles.field}>
                                    <label>Viáticos Agencia / día</label>
                                    <div className={styles.moneyInput}>
                                        <span className={styles.moneySymbol}>$</span>
                                        <input type="number" id="viaticosAgencia" value={costs.viaticosAgencia} onChange={handleCost} />
                                    </div>
                                </div>
                                <div className={styles.field}>
                                    <label>Fee pp</label>
                                    <div className={styles.moneyInput}>
                                        <span className={styles.moneySymbol}>$</span>
                                        <input type="number" id="feeParticipante" value={costs.feeParticipante} onChange={handleCost} />
                                    </div>
                                </div>

                                {/* Financials & Insurance */}
                                <div className={styles.field}>
                                    <label>Seguro pp</label>
                                    <div className={styles.moneyInput}>
                                        <span className={styles.moneySymbol}>$</span>
                                        <input type="number" id="costoSeguro" value={costs.costoSeguro} onChange={handleCost} />
                                    </div>
                                </div>
                                <div className={styles.field}>
                                    <label>Comisión (0.04)</label>
                                    <input className={styles.input} type="number" id="comisionBancaria" step="0.01" value={costs.comisionBancaria} onChange={handleCost} />
                                </div>

                                {/* Conditional Fields */}
                                {params.incluyeTransporteAeropuerto && (
                                    <>
                                        <div className={styles.field}>
                                            <label>Días Transp. Aerop.</label>
                                            <input className={styles.input} type="number" id="diasTranspAeropuerto" value={costs.diasTranspAeropuerto} onChange={handleCost} />
                                        </div>
                                        <div className={styles.field}>
                                            <label>Costo Transp. Aerop. pp/día</label>
                                            <div className={styles.moneyInput}>
                                                <span className={styles.moneySymbol}>$</span>
                                                <input type="number" id="transpAeropuertoPP" value={costs.transpAeropuertoPP} onChange={handleCost} />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {params.incluyeTransporteVisitas && (
                                    <>
                                        <div className={styles.field}>
                                            <label>Días Transp. Visitas</label>
                                            <input className={styles.input} type="number" id="diasTranspVisitas" value={costs.diasTranspVisitas} onChange={handleCost} />
                                        </div>
                                        <div className={styles.field}>
                                            <label>Costo Transp. Visitas pp/día</label>
                                            <div className={styles.moneyInput}>
                                                <span className={styles.moneySymbol}>$</span>
                                                <input type="number" id="transpVisitasPP" value={costs.transpVisitasPP} onChange={handleCost} />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {params.incluyeAlimentos && (
                                    <>
                                        <div className={styles.field}>
                                            <label>Costo Alimento Promedio</label>
                                            <div className={styles.moneyInput}>
                                                <span className={styles.moneySymbol}>$</span>
                                                <input type="number" id="costoAlimento" value={costs.costoAlimento} onChange={handleCost} />
                                            </div>
                                        </div>
                                        <div className={styles.field}>
                                            <label>Cantidad # Alimentos</label>
                                            <input className={styles.input} type="number" id="cantidadAlimentos" value={costs.cantidadAlimentos} onChange={handleCost} />
                                        </div>
                                    </>
                                )}

                                {params.contingenciaSingles && (
                                    <div className={styles.field}>
                                        <label>Factor Contingencia SGL</label>
                                        <input className={styles.input} type="number" id="factorSingles" step="0.1" value={costs.factorSingles} onChange={handleCost} />
                                    </div>
                                )}

                                {/* Full Width Text Areas */}
                                <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                                    <label>Detalles Hotel</label>
                                    <textarea className={styles.textarea} id="hotelConsiderado" placeholder="Detalles hotel" value={costs.hotelConsiderado} onChange={handleCost}></textarea>
                                </div>
                                <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                                    <label>Vuelo de Salida</label>
                                    <textarea className={styles.textarea} id="vueloSalida" placeholder="Día/Mes – Vuelo – Hora" value={costs.vueloSalida} onChange={handleCost}></textarea>
                                </div>
                                <div className={styles.field} style={{ gridColumn: '1 / -1' }}>
                                    <label>Vuelo de Regreso</label>
                                    <textarea className={styles.textarea} id="vueloRegreso" placeholder="Día/Mes – Vuelo – Hora" value={costs.vueloRegreso} onChange={handleCost}></textarea>
                                </div>

                                {/* Disclaimer */}
                                <div style={{ gridColumn: '1 / -1' }}>
                                    <p className={styles.hint}>
                                        El vuelo, seguro, fee y auxiliares se consideran por persona.
                                        Los viáticos y hotel de profesor y agencia se prorratean entre el mínimo de participantes.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Auxiliaries */}
                        <div className={`${styles.card} ${styles.cardSoft} mt-4`}>
                            <p className={styles.cardTitle}>Auxiliares por persona <span className={styles.tag}>entradas, extras</span></p>
                            {auxiliaries.map((aux) => (
                                <div key={aux.id} className={styles.auxRow}>
                                    <div className={styles.moneyInput} style={{ background: '#fff' }}>
                                        <input
                                            type="text"
                                            placeholder={`Auxiliar ${aux.id}`}
                                            value={aux.description}
                                            onChange={(e) => handleAux(aux.id, 'description', e.target.value)}
                                            style={{ textAlign: 'left' }}
                                        />
                                    </div>
                                    <div className={styles.moneyInput} style={{ background: '#fff' }}>
                                        <span className={styles.moneySymbol}>$</span>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={aux.value}
                                            onChange={(e) => handleAux(aux.id, 'value', e.target.value)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Results */}
                    <div className="right">
                        <div className={styles.resultPanel}>
                            <div className={styles.resultHeader}>
                                <p className={styles.resultHeaderTitle}>Resultados por persona</p>
                                <p className={styles.resultHeaderNote}>(USD)</p>
                            </div>

                            <table className={styles.tableOcupacion}>
                                <thead>
                                    <tr>
                                        <th>Ocupación</th>
                                        <th>Precio Final</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td>SGL</td><td>{formatMoney(results.sgl)}</td></tr>
                                    <tr><td>DBL</td><td>{formatMoney(results.dbl)}</td></tr>
                                    <tr><td>TPL</td><td>{formatMoney(results.tpl)}</td></tr>
                                    <tr><td>QUAD</td><td>{formatMoney(results.quad)}</td></tr>
                                </tbody>
                            </table>

                            <div className={styles.finCard}>
                                <div className={styles.finTitle}>Financiamiento (+5%)</div>
                                <div className={styles.field}>
                                    <label>Número de pagos</label>
                                    <input className={styles.input} type="number" value={numPagos} onChange={(e) => setNumPagos(e.target.value)} min={1} />
                                </div>
                                <table className={`${styles.tableOcupacion} ${styles.finTable}`}>
                                    <thead>
                                        <tr>
                                            <th>Ocup</th>
                                            <th>Total</th>
                                            <th>Cuota</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr><td>SGL</td><td>{formatMoney(results.finSgl)}</td><td>{formatMoney(results.pagoSgl)}</td></tr>
                                        <tr><td>DBL</td><td>{formatMoney(results.finDbl)}</td><td>{formatMoney(results.pagoDbl)}</td></tr>
                                        <tr><td>TPL</td><td>{formatMoney(results.finTpl)}</td><td>{formatMoney(results.pagoTpl)}</td></tr>
                                        <tr><td>QUAD</td><td>{formatMoney(results.finQuad)}</td><td>{formatMoney(results.pagoQuad)}</td></tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className={styles.summary} style={{ marginBottom: '12px' }}>
                                <div className={styles.summaryTitle}>Resumen de lo incluido</div>
                                <div className={styles.summaryLine}>
                                    Incluye: Vuelo, Hospedaje, Seguro, Fee.
                                    {params.incluyeTransporteAeropuerto && ', Transporte Aeropuerto'}
                                    {params.incluyeTransporteVisitas && ', Transporte Visitas'}
                                    {params.incluyeAlimentos && ', Alimentos'}
                                    {params.contingenciaSingles && ', Contingencia Singles'}.
                                    {auxiliaries.some(a => a.value && num(a.value) > 0) && ' Además: ' + auxiliaries.filter(a => a.value && num(a.value) > 0).map(a => a.description).join(', ') + '.'}
                                </div>
                            </div>

                            <div className={styles.obsCard}>
                                <div className={styles.obsTitle}>Observaciones</div>
                                <textarea className={styles.textarea} placeholder="Notas internas..." value={observaciones} onChange={(e) => setObservaciones(e.target.value)}></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
