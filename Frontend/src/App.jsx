import { useState } from "react";
import { CitySelect, StateSelect } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";

export default function App() {
  const [stateId, setStateId] = useState(0);
  const [formData, setFormData] = useState({
    age: "",
    weight: "",
    height: "",
    sex: "male",
    smoker: false,
    city: "",
    children: 0,
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [ageError, setAgeError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "age") {
      const ageValue = Number(value);
      if (ageValue > 120) {
        setAgeError("Vampires don't need Health Insurance, Age cannot exceed 120");
        return;
      } else {
        setAgeError("");
      }
      
      if (ageValue < 0) {
        setFormData({ ...formData, [name]: "0" });
        return;
      }
    }

    if (name === "weight") {
      const weightValue = Number(value);
      if (weightValue < 0) {
        setFormData({ ...formData, [name]: "0" });
        return;
      }
    }

    if (name === "height") {
      const heightValue = Number(value);
      if (heightValue < 0) {
        setFormData({ ...formData, [name]: "0" });
        return;
      }
      if (heightValue > 2.5) {
        setFormData({ ...formData, [name]: "2.5" });
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async () => {
    if (ageError) {
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("http://13.55.43.82:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          age: Number(formData.age),
          weight: Number(formData.weight),
          height: Number(formData.height),
          sex: formData.sex,
          smoker: formData.smoker,
          city: formData.city,
          children: Number(formData.children),
        }),
      });

      if (!res.ok) {
        throw new Error("Prediction failed");
      }

      const data = await res.json();
      setResult(data.predicted_premium_category);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-slate-800 rounded-xl border border-slate-700 p-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          Insurance Premium Predictor
        </h1>
        <p className="text-sm text-slate-400 mb-6">
          Enter your details to estimate your insurance premium category
        </p>

        <div className="space-y-4">
          {/* Age with Slider */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Age
            </label>
            <div className="flex gap-4 items-center">
              <input
                type="range"
                name="age"
                min="0"
                max="120"
                value={formData.age || 0}
                onChange={handleChange}
                className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-20 rounded-lg bg-slate-700 border border-slate-600 px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            {ageError && (
              <p className="mt-1 text-sm text-red-400">{ageError}</p>
            )}
          </div>

          {/* Weight & Height */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full rounded-lg bg-slate-700 border border-slate-600 px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Height (m)
              </label>
              <input
                type="number"
                step="0.01"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="w-full rounded-lg bg-slate-700 border border-slate-600 px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Sex */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Sex
            </label>
            <select
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-700 border border-slate-600 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* Smoker */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="smoker"
              checked={formData.smoker}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 bg-slate-700 border-slate-600 rounded"
            />
            <label className="text-sm text-slate-300">I am a smoker</label>
          </div>

          {/* State Dropdown */}
<div>
  <label className="block text-sm font-medium text-slate-300 mb-1">
    State
  </label>
  <div className="city-select-wrapper">
    <StateSelect
      countryid={101}
      onChange={(e) => {
        setStateId(e.id);
      }}
      placeHolder="Select State"
    />
  </div>
</div>

{/* City Dropdown */}
{stateId !== 0 && (
  <div>
    <label className="block text-sm font-medium text-slate-300 mb-1">
      City
    </label>
    <div className="city-select-wrapper">
      <CitySelect
        countryid={101}
        stateid={stateId}
        onChange={(e) => {
          setFormData({ ...formData, city: e.name });
        }}
        inputProps={{ spellCheck: "false" }}
        placeHolder="Select City"
      />
    </div>
  </div>
)}

          {/* Children */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Number of Children
            </label>
            <input
              type="number"
              min="0"
              name="children"
              value={formData.children}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-700 border border-slate-600 px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading || ageError}
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50 mt-2"
          >
            {loading ? "Predicting..." : "Predict Premium"}
          </button>
        </div>

        {/* Result */}
        {result && (
  <div className={`mt-6 p-5 rounded-lg border ${
    result.predicited_category === "high"
      ? "bg-red-900/30 border-red-700"
      : result.predicited_category === "medium"
      ? "bg-yellow-900/30 border-yellow-700"
      : "bg-green-900/30 border-green-700"
  }`}>

    <p className="text-sm text-slate-400 mb-1">
      Predicted Premium Category
    </p>

    <p className={`text-2xl font-bold mb-4 ${
      result.predicited_category === "high"
        ? "text-red-300"
        : result.predicited_category === "medium"
        ? "text-yellow-300"
        : "text-green-300"
    }`}>
      {result.predicited_category.toUpperCase()}
    </p>

    {/* Confidence */}
    <div className="mb-4">
      <p className="text-sm text-slate-400">Confidence</p>
      <p className="text-lg font-semibold text-white">
        {(result.confidence * 100).toFixed(1)}%
      </p>
    </div>

    {/* Class Probabilities */}
    <div className="space-y-2">
      {Object.entries(result.class_probabilities).map(([key, value]) => (
        <div key={key}>
          <div className="flex justify-between text-sm text-slate-300 mb-1">
            <span>{key.toUpperCase()}</span>
            <span>{(value * 100).toFixed(1)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded">
            <div
              className={`h-2 rounded ${
                key === "high"
                  ? "bg-red-500"
                  : key === "medium"
                  ? "bg-yellow-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${value * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>
)}


        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      </div>
      
<style>{`
.city-select-wrapper {
  width: 100%;
}

/* Target all control variants */
.city-select-wrapper [class*="-control"] {
  background-color: rgb(51 65 85) !important;
  border-color: rgb(51 65 85) !important;
  border-radius: 0.5rem !important;
  min-height: 42px !important;
  box-shadow: none !important;
}

/* Focused state */
.city-select-wrapper [class*="-control"]:hover,
.city-select-wrapper [class*="-control"]:focus-within {
  border-color: rgb(51 65 85) !important;
  box-shadow: none !important;
}

/* Selected value */
.city-select-wrapper [class*="-singleValue"] {
  color: rgb(255 255 255) !important;
}

/* Input text */
.city-select-wrapper input {
  color: rgb(255 255 255) !important;
  caret-color: rgb(255 255 255) !important;
}

/* Placeholder */
.city-select-wrapper [class*="-placeholder"] {
  color: rgb(148 163 184) !important;
}

/* Dropdown menu */
.city-select-wrapper [class*="-menu"] {
  background-color: rgb(51 65 85) !important;
  border-radius: 0.5rem !important;
  border: 1px solid rgb(51 65 85) !important;
}

/* Menu list */
.city-select-wrapper [class*="-MenuList"] {
  background-color: rgb(51 65 85) !important;
}

/* All options */
.city-select-wrapper [class*="-option"] {
  background-color: rgb(51 65 85) !important;
  color: rgb(226 232 240) !important;
}

/* Hovered option */
.city-select-wrapper [class*="-option"]:hover {
  background-color: rgb(79 70 229) !important;
  color: white !important;
}

/* Indicators (dropdown arrow, clear) */
.city-select-wrapper [class*="-indicatorSeparator"] {
  display: none !important;
}

.city-select-wrapper [class*="-indicatorContainer"] {
  color: rgb(148 163 184) !important;
}
`}</style>



    </div>
  );
}