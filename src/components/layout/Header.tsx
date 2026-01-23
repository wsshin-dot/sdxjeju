import { MapPin, Users, Calendar, Cloud, Sun, CloudRain, CloudLightning, Snowflake } from 'lucide-react';
import { useWeather } from '../../hooks/useWeather';
import { useRainMode } from '../../contexts/RainModeContext';

interface HeaderProps {
    personCount: number;
}

export function Header({ personCount }: HeaderProps) {
    const { weather, loading } = useWeather();
    const { isRainy, toggleRainMode } = useRainMode();

    const getWeatherIcon = (iconName: string) => {
        switch (iconName) {
            case 'cloud-sun': return <Cloud className="w-3 h-3 text-white" />; // Lucide doesn't have CloudSun exact match maybe? Using Cloud for now or combine.
            case 'smog': return <Cloud className="w-3 h-3 text-gray-200" />;
            case 'cloud-rain': return <CloudRain className="w-3 h-3 text-blue-200" />;
            case 'snowflake': return <Snowflake className="w-3 h-3 text-white" />;
            case 'cloud-lightning': return <CloudLightning className="w-3 h-3 text-yellow-200" />;
            case 'cloud': return <Cloud className="w-3 h-3 text-gray-200" />;
            default: return <Sun className="w-3 h-3 text-yellow-300" />;
        }
    };

    return (
        <header className="relative bg-gradient-to-br from-primary to-[#FF9E40] text-white p-6 pb-8 rounded-b-[30px] overflow-hidden shadow-lg z-10">
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.2)_0%,transparent_60%)] animate-[spin_20s_linear_infinite]" />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-3">
                    <span className="inline-block bg-white/25 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold border border-white/30">
                        🍊 Jeju Team Day
                    </span>
                    <button
                        onClick={toggleRainMode}
                        className={`p-2 rounded-full backdrop-blur-md transition-all ${isRainy ? 'bg-blue-500/50 text-white' : 'bg-white/20 text-yellow-300 hover:bg-white/30'}`}
                    >
                        {isRainy ? <CloudRain className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                    </button>
                </div>
                <h1 className="text-3xl font-bold mb-2 tracking-tight">SDx 플랫폼팀<br />제주도 워크샵</h1>

                <div className="flex flex-wrap gap-3 text-sm opacity-90 font-medium">
                    <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> 2.5(목) ~ 2.7(토)
                    </span>
                    <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> {personCount}명
                    </span>
                    <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> 씨사이드 아덴
                    </span>
                    <span className="flex items-center gap-1">
                        {loading ? (
                            <span className="animate-pulse">날씨 로딩중...</span>
                        ) : (
                            <>
                                {weather && getWeatherIcon(weather.icon)} {weather ? `서귀포 ${weather.temp}°C` : 'N/A'}
                            </>
                        )}
                    </span>
                </div>
            </div>
        </header>
    );
}
