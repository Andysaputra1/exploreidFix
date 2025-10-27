import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';

interface ItineraryProps {
  place: string;
}

const Itinerary: React.FC<ItineraryProps> = ({ place }) => {
  const [open, setOpen] = useState(false);
  const [days, setDays] = useState(3);
  const [itinerary, setItinerary] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // State untuk loading
  const [error, setError] = useState<string | null>(null); // State untuk error

  // --- START REVISI generateItinerary ---
  const generateItinerary = async () => { // Tambahkan 'async'
    setLoading(true); // Mulai loading
    setError(null); // Reset error
    setItinerary(null); // Bersihkan itinerary lama

    const backendUrl = 'http://127.0.0.1:5000/itinerary/generate'; // URL backend Flask kamu

    try {
        const response = await fetch(backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Penting: Kirim sebagai JSON
            },
            body: JSON.stringify({ days: days }), // Kirim jumlah hari sebagai JSON
        });

        if (response.ok) {
            const result = await response.json();
            // Format hasil itinerary dari backend ke string yang bisa ditampilkan
            let formattedItinerary = '';
            if (Array.isArray(result) && result.length > 0) {
                result.forEach((dayData: any) => {
                    formattedItinerary += `Day ${dayData.day}:\n`;
                    if (Array.isArray(dayData.schedule) && dayData.schedule.length > 0) {
                        dayData.schedule.forEach((item: any) => {
                            formattedItinerary += `  ${item.start_time} - ${item.end_time}: ${item.destination_name}`;
                            if (item.price && item.price !== 'N/A') {
                                formattedItinerary += ` (${item.price})`;
                            }
                            formattedItinerary += '\n';
                        });
                    } else {
                        formattedItinerary += `  No activities planned for this day.\n`;
                    }
                    formattedItinerary += '\n';
                });
            } else {
                formattedItinerary = "No itinerary could be generated for the given days.";
            }
            setItinerary(formattedItinerary);
        } else {
            const errorData = await response.json();
            setError(errorData.error || 'Failed to generate itinerary.');
            console.error('Itinerary generation error:', errorData);
        }
    } catch (err) {
        console.error('Error generating itinerary:', err);
        setError('Network error or server unreachable. Please try again.');
    } finally {
        setLoading(false); // Selesai loading
    }
  };
  // --- END REVISI generateItinerary ---

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-300 text-white py-3 px-6 rounded-full shadow-lg flex items-center gap-2 font-bold transition duration-300 z-[20]"
        >
          <Sparkles className="w-5 h-5 text-white" />
          <span className="hidden md:block">Create Itinerary</span>
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 w-[350px] bg-blue-100 text-blue-900 p-6 rounded-3xl shadow-2xl transition-all duration-700 z-[20]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-blue-700">Itinerary Generator</h3>
            <button onClick={() => setOpen(false)}>
              <X className="text-blue-500 hover:text-red-500" />
            </button>
          </div>

          <p className="text-sm mb-3">
            Plan your trip to <span className="font-semibold">{place}</span> and customize your itinerary.
          </p>

          <label className="block mb-2 text-sm">Number of Days:</label>
          <input
            type="number"
            min={1}
            max={10}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-full bg-blue-200 text-blue-900 p-2 rounded-md mb-4 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <button
            onClick={generateItinerary}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            disabled={loading} // Disable button saat loading
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>

          {error && ( // Tampilkan error jika ada
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              Error: {error}
            </div>
          )}

          {itinerary && (
            <div className="mt-4 max-h-[200px] overflow-auto bg-blue-50 p-4 rounded-lg shadow-inner">
              <h4 className="text-blue-600 text-sm font-semibold mb-2">Your Itinerary</h4>
              <pre className="text-sm whitespace-pre-wrap">{itinerary}</pre>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Itinerary;