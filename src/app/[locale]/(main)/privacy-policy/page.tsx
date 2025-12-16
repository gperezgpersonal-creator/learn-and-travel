import { useTranslations } from 'next-intl';

export default function PrivacyPolicyPage() {
    return (
        <main className="py-20 bg-slate-50 min-h-screen">
            <div className="container-custom max-w-4xl bg-white p-8 md:p-12 rounded-xl shadow-sm">
                <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-800 mb-8 max-w-2xl leading-tight">
                    Aviso de Privacidad de Ariagui Services LLC (Learn and Travel)
                </h1>
                <p className="text-sm text-slate-500 mb-8 border-b border-slate-100 pb-4">
                    Última actualización: 18 de julio 2024
                </p>

                <div className="prose prose-slate max-w-none text-slate-600">
                    <p>
                        En Ariagui Services LLC, operando bajo el nombre comercial Learn and Travel, estamos profundamente comprometidos con la protección de su privacidad. Este aviso de privacidad explica nuestras prácticas respecto a la recopilación, uso y divulgación de sus datos personales. Al utilizar nuestro sitio web www.learn-and-travel.com y nuestros servicios, usted acepta las prácticas descritas en este aviso de privacidad.
                    </p>

                    <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">1. Nuestro Compromiso con su Privacidad</h2>
                    <p>
                        Ariagui Services LLC, bajo el nombre comercial Learn and Travel, se compromete a proteger la privacidad de nuestros clientes potenciales y existentes. Esta política de privacidad ("Política de Privacidad") se aplica a todos los Datos Personales (según se define a continuación) que procesamos, incluidos los datos personales recopilados o enviados a través de nuestros sitios web, correos electrónicos, aplicaciones móviles o a través de nuestras páginas oficiales en redes sociales, o a través de otros canales en línea y fuera de línea, como se describe más adelante (colectivamente, los "Productos Learn and Travel").
                    </p>
                    <p>
                        Si usted no puede o no desea proporcionarnos la información personal que razonablemente requerimos, es posible que no podamos proporcionarle la información, bienes o servicios que ha solicitado.
                    </p>

                    <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">2. Datos Personales</h2>
                    <p>"Datos Personales" se refiere a información o fragmentos de información que podrían permitir su identificación, tales como:</p>
                    <ul className="list-disc pl-5 space-y-2 mt-4">
                        <li>Nombre y datos de contacto (por ejemplo, dirección postal y de correo electrónico, número de teléfono)</li>
                        <li>Información de perfil (por ejemplo, nombre de usuario, foto de perfil o ID de cuenta en redes sociales)</li>
                        <li>Número de Seguro Social</li>
                        <li>País de residencia</li>
                        <li>Fecha de nacimiento</li>
                        <li>Género</li>
                        <li>Información técnica, por ejemplo, nombre de pantalla, dirección IP, datos del navegador y del dispositivo, información recopilada a través de cookies, etiquetas de píxel y otras tecnologías, datos de archivos de registro del servidor, datos de uso de aplicaciones y datos de ubicación</li>
                        <li>Preferencias (por ejemplo, hábitos de compra y navegación, cursos educativos preferidos)</li>
                        <li>Nombre y dirección de la empresa o escuela</li>
                        <li>Número de tarjeta de crédito y débito y/o números de cuenta corriente y de ruta</li>
                        <li>Número de pasaporte y/o número de licencia de conducir</li>
                        <li>Condiciones médicas (por ejemplo, alergias o enfermedades)</li>
                        <li>Otra información que proporcione durante una llamada telefónica o de video o un chat, y grabaciones y/o transcripciones de dichas llamadas o chats.</li>
                    </ul>

                    <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">3. ¿Cómo Recopilamos los Datos Personales?</h2>
                    <p>Recopilamos datos personales de diversas maneras:</p>
                    <ul className="list-disc pl-5 space-y-4 mt-4">
                        <li>
                            <strong>Directamente de usted:</strong> La información se recopila directamente de usted, ya sea proporcionando la información directamente o actuando de manera que nos proporciona la información.
                        </li>
                        <li>
                            <strong>A través del uso de una aplicación móvil:</strong> Cuando descarga y utiliza una de nuestras aplicaciones móviles, y en la medida en que lo permitan sus configuraciones de privacidad en la aplicación, rastreamos y recopilamos datos de uso de la aplicación móvil, como la fecha y hora en que la aplicación móvil en su dispositivo accedió a nuestros servidores y qué información y archivos se han descargado en la aplicación móvil según el número de su dispositivo.
                        </li>
                        <li>
                            <strong>A través de su dispositivo:</strong> Siempre que haya habilitado esa función en su dispositivo, recopilamos la ubicación física de este para proporcionarle servicios y contenido personalizados basados en la ubicación.
                        </li>
                        <li>
                            <strong>A través de enlaces:</strong> Rastreamos y recopilamos información sobre cómo los usuarios interactúan con los enlaces a través de productos y servicios, incluidos los correos electrónicos y los enlaces disponibles a través de servicios de terceros.
                        </li>
                        <li>
                            <strong>Al navegar por nuestros sitios:</strong> También podemos recopilar información sobre su uso de nuestros servicios a través de su navegador para rastrear la actividad en nuestros sitios, como su dirección IP, dirección de Control de Acceso a Medios (MAC), tipo de computadora, resolución de pantalla, sistema operativo, etc.
                        </li>
                        <li>
                            <strong>A través de cookies:</strong> Las "cookies" son fragmentos de información que un sitio web transfiere al disco duro de su computadora para fines de mantenimiento de registros. Utilizamos tanto cookies de sesión como persistentes.
                        </li>
                        <li>
                            <strong>Fuera de línea:</strong> Recopilamos datos personales de usted fuera de línea, por ejemplo, cuando contacta al servicio de atención al cliente, se inscribe en un producto o servicio, o nos proporciona información por escrito o durante una llamada telefónica o de video.
                        </li>
                        <li>
                            <strong>De nuestros afiliados corporativos, socios comerciales, proveedores de asistencia o gestores de reclamaciones.</strong>
                        </li>
                        <li>
                            <strong>De otras fuentes:</strong> Podemos recibir sus datos personales de bases de datos públicas, socios de marketing conjunto, plataformas de redes sociales, etc.
                        </li>
                    </ul>

                    <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">4. ¿Cómo Utilizamos los Datos Personales?</h2>
                    <p>
                        Sus datos personales serán procesados por Learn and Travel para los fines de completar su reserva, proporcionarle los productos y servicios que ha solicitado (incluida la cobertura de seguro de viaje), para servicios de atención al cliente, servicios administrativos o según sea necesario para cumplir el contrato entre usted y nosotros. También podemos utilizar los datos personales para:
                    </p>
                    <ul className="list-disc pl-5 space-y-2 mt-4">
                        <li>Fines estadísticos y de diagnóstico de problemas.</li>
                        <li>Permitirle contactar y ser contactado por otros usuarios.</li>
                        <li>Permitirle participar en foros, chats y blogs.</li>
                        <li>Analizar y mejorar nuestras ofertas y personalizar la experiencia.</li>
                        <li>Proporcionarle servicios y contenido personalizados basados en la ubicación.</li>
                        <li>Comercializar nuestros productos y servicios.</li>
                    </ul>

                    <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">5. ¿Cómo Compartimos los Datos Personales?</h2>
                    <p>Compartimos sus datos personales con nuestros afiliados corporativos, socios comerciales y proveedores de servicios, tanto dentro como fuera de los EE. UU. y Canadá:</p>
                    <ul className="list-disc pl-5 space-y-2 mt-4">
                        <li>Afiliados corporativos.</li>
                        <li>Socios comerciales (ej. agentes de ventas, proveedores de transporte, alojamiento, seguros).</li>
                        <li>Proveedores de servicios (ej. sistemas de TI, marketing).</li>
                    </ul>

                    <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">6. Seguridad</h2>
                    <p>
                        Utilizamos medidas organizativas, técnicas y administrativas adecuadas para mantener los datos personales bajo nuestro control precisos y actualizados, así como para proteger los datos personales contra el procesamiento no autorizado o ilegal y la pérdida, destrucción o daño accidental.
                    </p>

                    <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">7. Darse de Baja del Marketing por Correo Electrónico</h2>
                    <p>
                        Para respetar la privacidad de nuestros usuarios, puede optar por no recibir correos electrónicos comerciales de nuestra parte siguiendo las instrucciones de cancelación de suscripción contenidas en los correos electrónicos comerciales que le enviamos.
                    </p>

                    <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">8. Sitios de Terceros</h2>
                    <p>
                        Esta Política de Privacidad no aborda, y no somos responsables de, la privacidad, la información u otras prácticas de terceros, incluidos aquellos que operan cualquier sitio al que los Productos Learn and Travel contengan un enlace.
                    </p>

                    <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">9. Si es Menor de 13 Años</h2>
                    <p>
                        Si es menor de 13 años, debe revisar este texto junto con su padre o tutor para asegurarse de que ambos lo entienden. No somos responsables de verificar su edad, pero a veces realizamos verificaciones.
                    </p>

                    <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">10. Actualizaciones a Esta Política de Privacidad</h2>
                    <p>
                        Nuestra Política de Privacidad puede cambiar de vez en cuando. Cualquier cambio material a esta política se publicará en nuestra página web para mantenerle informado.
                    </p>

                    <h2 className="text-xl font-bold text-slate-800 mt-8 mb-4">11. Contacto</h2>
                    <p>Si tiene preguntas sobre esta Política de Privacidad, por favor contáctenos en:</p>
                    <p className="mt-4 font-bold text-primary">
                        Correo electrónico: contacto@ariagui.com
                    </p>
                </div>
            </div>
        </main>
    );
}
