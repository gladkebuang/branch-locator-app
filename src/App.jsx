import React, { useState, useEffect, useMemo, useCallback } from 'react';

// --- ICON MOCKING (Inline SVGs) ---
const Icon = ({ path, ...props }) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {path.map((d, i) => <path key={i} d={d} />)}
    </svg>
);
const Map = (props) => <Icon {...props} path={["M14.5 4h.5c.2 0 .4.1.6.2l3.4 2.8c.6.5 1 1.2 1 2V19c0 .7-.3 1.4-.8 1.9l-3.4 2.8c-.2.1-.4.2-.6.2h-.5c-.2 0-.4-.1-.6-.2l-3.4-2.8c-.6-.5-1-1.2-1-2V5c0-.7.3-1.4.8-1.9l3.4-2.8c.2-.1.4-.2.6-.2z", "M9.5 4h-.5c-.2 0-.4.1-.6.2l-3.4 2.8c-.6.5-1 1.2-1 2V19c0 .7.3 1.4.8 1.9l3.4 2.8c.2.1.4.2.6.2h.5c.2 0 .4-.1.6-.2l3.4-2.8c.6-.5 1-1.2 1-2V5c0-.7-.3-1.4-.8-1.9l-3.4-2.8c-.2-.1-.4-.2-.6-.2z"]}/>;
const MapPin = (props) => <Icon {...props} path={["M12 20s-8-6-8-10c0-4.42 3.58-8 8-8s8 3.58 8 8c0 4-8 10-8 10z", "M12 11c-1.66 0-3-1.34-3-3s1.34-3 3-3s3 1.34 3 3s-1.34 3-3 3z"]}/>;
const Search = (props) => <Icon {...props} path={["M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16z","M21 21l-4.3-4.3"]}/>;
const Phone = (props) => <Icon {...props} path={["M22 16.92v3.06c0 1.33-1.08 2.4-2.41 2.4-1.24 0-2.45-.48-3.32-1.35l-3.8-3.79c-.87-.87-1.35-2.08-1.35-3.32c0-1.33 1.08-2.41 2.41-2.41H17v-4c0-1.66-1.34-3-3-3H6c-1.66 0-3 1.34-3 3v12c0 1.66 1.34 3 3 3h8c1.66 0 3-1.34 3-3v-4.08c0-.3-.23-.55-.54-.59L17 11.23c.31-.04.54-.29.54-.59V6h4c1.66 0 3 1.34 3 3v1.06c0 .3-.23.55-.54.59L22 16.92z"]}/>;
const Clock = (props) => <Icon {...props} path={["M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z","M12 6v6l4 2"]}/>;
const ChevronRight = (props) => <Icon {...props} path={["M9 18l6-6-6-6"]}/>;
const Menu = (props) => <Icon {...props} path={["M4 12h16","M4 6h16","M4 18h16"]}/>;

// --- MOCK MAPPING COMPONENTS ---
const MapContainer = ({ center, zoom, children }) => (
    <div className="w-full h-full relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-medium border-4 border-dashed border-gray-400 m-4 rounded-xl bg-white/50 backdrop-blur-sm shadow-inner">
            <div className="text-center p-4">
                <Map className="w-8 h-8 mx-auto text-blue-500 mb-2"/>
                <p className="font-semibold mb-1">Interactive Map Placeholder</p>
                <p className="text-sm text-gray-500">
                    Map centered at:<br/>
                    Lat: <span className="font-mono">{center[0].toFixed(4)}</span>, 
                    Lng: <span className="font-mono">{center[1].toFixed(4)}</span> (Zoom: {zoom}x)
                </p>
            </div>
        </div>
        {children}
    </div>
);
const TileLayer = () => null;
const Marker = ({ children }) => (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
        {children}
    </div>
);


// --- MOCK DATA ---
const MOCK_BRANCHES = [
    {
        id: 'B001',
        name: 'Sandton City Branch',
        address: '88 Maude St, Sandton, 2196',
        city: 'Johannesburg',
        phone: '011-555-1001',
        hours: 'Mon-Fri: 9:00 - 17:00',
        services: ['ATM', 'Teller', 'Advice'],
        position: [-26.1082, 28.0573], // Johannesburg area
    },
    {
        id: 'B002',
        name: 'Cape Town CBD Flagship',
        address: '1 Riebeek St, Cape Town, 8000',
        city: 'Cape Town',
        phone: '021-555-2002',
        hours: 'Mon-Fri: 8:30 - 16:30',
        services: ['ATM', 'Private Banking', 'Teller'],
        position: [-33.9188, 18.4233], // Cape Town area
    },
    {
        id: 'B003',
        name: 'Menlyn Park Branch',
        address: 'Cnr Atterbury Road & Lois Ave, Pretoria, 0081',
        city: 'Pretoria',
        phone: '012-555-3003',
        hours: 'Mon-Sat: 9:00 - 13:00',
        services: ['ATM', 'Self Service', 'Teller'],
        position: [-25.7831, 28.2750], // Pretoria area
    },
    {
        id: 'B004',
        name: 'Durban Gateway Branch',
        address: '1 Palm Blvd, Umhlanga, 4319',
        city: 'Durban',
        phone: '031-555-4004',
        hours: 'Mon-Fri: 9:00 - 17:00',
        services: ['ATM', 'Teller'],
        position: [-29.7121, 31.0664], // Durban area
    },
];

// Default map view
const DEFAULT_CENTER = [-29.0000, 24.0000];
const DEFAULT_ZOOM = 6;


// --- COMPONENTS ---

const BranchDetailsPanel = ({ branch, onClose }) => {
    if (!branch) return null;

    const { name, address, phone, hours, services } = branch;

    return (
        <div className="absolute inset-x-0 bottom-0 lg:bottom-auto lg:right-4 lg:top-1/2 lg:-translate-y-1/2 bg-white p-6 shadow-2xl rounded-t-xl lg:rounded-xl z-30 w-full lg:w-96 transform transition-transform duration-300 ease-out border-t-4 border-blue-600">
            <button
                onClick={onClose}
                className="absolute top-3 right-3 p-2 text-gray-500 hover:text-gray-900 transition bg-gray-100 rounded-full"
                aria-label="Close details"
            >
                <span className="text-xl font-bold leading-none">&times;</span>
            </button>
            <h3 className="text-2xl font-bold text-blue-800 mb-2">{name}</h3>
            <p className="text-gray-600 mb-4">{address}</p>

            <div className="space-y-4 text-sm">
                <div className="flex items-center text-gray-800">
                    <Phone className="w-4 h-4 mr-3 text-blue-500 flex-shrink-0" />
                    <span className="font-medium">{phone}</span>
                </div>
                <div className="flex items-start text-gray-800">
                    <Clock className="w-4 h-4 mr-3 text-blue-500 flex-shrink-0 mt-0.5" />
                    <p className="font-medium">{hours}</p>
                </div>
                <div className="flex items-start text-gray-800">
                    <Menu className="w-4 h-4 mr-3 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold mb-1">Available Services:</p>
                        <div className="flex flex-wrap gap-2">
                            {services.map(service => (
                                <span key={service} className="px-3 py-1 bg-blue-50 text-xs font-medium text-blue-700 rounded-full border border-blue-200">
                                    {service}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <button className="mt-6 w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl">
                Get Directions
            </button>
        </div>
    );
};

const BranchList = ({ branches, onSelectBranch, selectedBranchId }) => (
    <div className="h-full overflow-y-auto space-y-3 p-4">
        {branches.map((branch) => (
            <div
                key={branch.id}
                onClick={() => onSelectBranch(branch)}
                className={`flex justify-between items-center p-4 rounded-xl cursor-pointer transition duration-150 border-2 ${
                    selectedBranchId === branch.id
                        ? 'bg-blue-50 border-blue-500 shadow-md ring-2 ring-blue-200'
                        : 'bg-white border-gray-100 hover:border-blue-300 hover:shadow-sm'
                }`}
            >
                <div>
                    <p className="font-semibold text-gray-800">{branch.name}</p>
                    <p className="text-sm text-gray-500">{branch.address.split(',')[0]}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-blue-500" />
            </div>
        ))}
        {branches.length === 0 && (
            <p className="text-center text-gray-500 mt-10 p-4">
                <Search className="w-6 h-6 mx-auto mb-2"/>
                No branches found matching your search.
            </p>
        )}
    </div>
);


const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [branches] = useState(MOCK_BRANCHES);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);
    const [mapZoom, setMapZoom] = useState(DEFAULT_ZOOM);

    const filteredBranches = useMemo(() => {
        if (!searchTerm) return branches;
        const lowerCaseSearch = searchTerm.toLowerCase();
        return branches.filter(branch => 
            branch.name.toLowerCase().includes(lowerCaseSearch) ||
            branch.city.toLowerCase().includes(lowerCaseSearch) ||
            branch.address.toLowerCase().includes(lowerCaseSearch)
        );
    }, [branches, searchTerm]);

    const handleSelectBranch = useCallback((branch) => {
        setSelectedBranch(branch);
        setMapCenter(branch.position);
        setMapZoom(13);
    }, []);

    useEffect(() => {
        if (!searchTerm) {
            if (!selectedBranch) {
                setMapCenter(DEFAULT_CENTER);
                setMapZoom(DEFAULT_ZOOM);
            }
        }
    }, [searchTerm, selectedBranch]);


    return (
        <div className="h-screen flex flex-col lg:flex-row bg-gray-50 font-sans">
            
            <div className="w-full lg:w-96 flex-shrink-0 bg-white shadow-2xl flex flex-col h-1/2 lg:h-full overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-2xl font-extrabold text-gray-900 flex items-center">
                        <Map className="w-7 h-7 mr-2 text-blue-600"/> Branch Finder
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {filteredBranches.length} branch{filteredBranches.length !== 1 ? 'es' : ''} found in total.
                    </p>
                </div>
                
                <div className="p-4 border-b border-gray-100">
                    <div className="relative">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by city or branch name..."
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 shadow-inner"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => { setSearchTerm(''); setSelectedBranch(null); }}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-800 text-xl font-bold"
                            >
                                &times;
                            </button>
                        )}
                    </div>
                </div>

                <BranchList 
                    branches={filteredBranches} 
                    onSelectBranch={handleSelectBranch} 
                    selectedBranchId={selectedBranch?.id} 
                />
            </div>

            <div className="flex-1 relative h-1/2 lg:h-full bg-gray-200">
                <MapContainer center={mapCenter} zoom={mapZoom}>
                    <TileLayer />
                    
                    {selectedBranch && (
                        <Marker position={selectedBranch.position}>
                            <div 
                                className="p-2 rounded-full shadow-xl animate-pulse cursor-pointer" 
                                style={{ backgroundColor: 'rgb(239 68 68)' }} 
                                onClick={() => handleSelectBranch(selectedBranch)}
                            >
                                <MapPin className="w-6 h-6 text-white" />
                            </div>
                        </Marker>
                    )}
                </MapContainer>
                
                <BranchDetailsPanel 
                    branch={selectedBranch} 
                    onClose={() => setSelectedBranch(null)} 
                />
            </div>
        </div>
    );
};

export default App;
