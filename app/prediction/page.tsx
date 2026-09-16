export default function RainPredictionPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6 max-w-[1500px] mx-auto w-full text-slate-900">
      {/* SECTION 1: CURRENT PREDICTION */}
      <div className="bg-gradient-to-br from-cyan-900 via-cyan-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-cyan-700/50 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-cyan-500/10 pointer-events-none blur-2xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex flex-col gap-2.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 text-xs font-semibold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[15px]">insights</span>
                Current Prediction
              </span>
              <span className="text-cyan-200/70 text-xs">•</span>
              <span className="text-cyan-200/90 text-xs font-medium">
                Prediction window: Next 3 hours
              </span>
            </div>
            <div className="flex flex-wrap items-baseline gap-4 mt-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 shrink-0">
                  <span className="material-symbols-outlined text-[32px]">weather_mix</span>
                </div>
                <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                  Rain Likely
                </span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-400/20 border border-amber-300/40 text-amber-200 text-sm font-bold">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                78% confidence
              </div>
            </div>
            <p className="text-cyan-50 text-sm sm:text-base font-normal mt-1 leading-relaxed">
              Humidity is high and increasing while atmospheric pressure is falling. Trend
              analysis indicates rain precipitation is probable within the forecast window.
            </p>
          </div>

          {/* State Indicator Matrix */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/15 flex flex-col gap-2.5 shrink-0 min-w-[240px] w-full md:w-auto">
            <span className="text-[11px] uppercase tracking-wider text-cyan-200 font-bold">
              Model State Indicators
            </span>
            <div className="flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between px-2.5 py-1.5 rounded bg-amber-400/20 border border-amber-300/30 text-white font-semibold">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  Rain Likely
                </span>
                <span className="text-[10px] text-amber-200 font-bold uppercase">Active</span>
              </div>
              <div className="flex items-center justify-between px-2.5 py-1.5 rounded bg-white/5 text-cyan-200/60">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400/50"></span>
                  Monitoring Conditions
                </span>
                <span className="text-[10px] uppercase">Standby</span>
              </div>
              <div className="flex items-center justify-between px-2.5 py-1.5 rounded bg-white/5 text-cyan-200/60">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400/50"></span>
                  Rain Unlikely
                </span>
                <span className="text-[10px] uppercase">Off</span>
              </div>
              <div className="flex items-center justify-between px-2.5 py-1.5 rounded bg-white/5 text-cyan-200/60">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400/50"></span>
                  Rain Detected
                </span>
                <span className="text-[10px] uppercase">Dry</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: CURRENT ENVIRONMENTAL CONDITIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Temperature */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-cyan-600/40 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Temperature</span>
            <span className="material-symbols-outlined text-[18px] text-slate-400">
              device_thermostat
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-slate-900 tracking-tight">21.4 °C</span>
            <span className="inline-flex items-center text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              Stable
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">±0.2°C variation over 3h</p>
        </div>

        {/* Humidity (Triggered) */}
        <div className="bg-white rounded-xl p-4 border-2 border-cyan-500 shadow-xs bg-gradient-to-b from-cyan-50/40 to-white transition-colors">
          <div className="flex items-center justify-between text-cyan-800">
            <span className="text-xs font-bold uppercase tracking-wider">Humidity</span>
            <span className="material-symbols-outlined text-[18px] text-cyan-700">
              humidity_percentage
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-cyan-900 tracking-tight">85.1 %</span>
            <span className="inline-flex items-center gap-0.5 text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span>{" "}
              Increasing
            </span>
          </div>
          <p className="text-[11px] text-cyan-700 font-medium mt-1">
            Exceeds 75% trigger threshold
          </p>
        </div>

        {/* Air Pressure (Triggered) */}
        <div className="bg-white rounded-xl p-4 border-2 border-amber-400 shadow-xs bg-gradient-to-b from-amber-50/30 to-white transition-colors">
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-xs font-bold uppercase tracking-wider">Air Pressure</span>
            <span className="material-symbols-outlined text-[18px] text-amber-600">
              compress
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-2xl font-bold text-amber-900 tracking-tight">
              1008.2 <span className="text-xs font-normal text-slate-500">hPa</span>
            </span>
            <span className="inline-flex items-center gap-0.5 text-xs font-bold text-amber-800 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded">
              <span className="material-symbols-outlined text-[14px]">arrow_downward</span> Falling
            </span>
          </div>
          <p className="text-[11px] text-amber-700 font-medium mt-1">
            −1.8 hPa drop over last 3 hours
          </p>
        </div>

        {/* Rain Sensor */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs hover:border-cyan-600/40 transition-colors">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Rain Sensor</span>
            <span className="material-symbols-outlined text-[18px] text-slate-400">rainy</span>
          </div>
          <div className="mt-2.5 flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-800 tracking-tight">No Rain</span>
            <span className="inline-flex items-center text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              Dry Baseline
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Zero precipitation detected yet</p>
        </div>
      </div>

      {/* SECTION 3: ENVIRONMENTAL TRENDS CHART */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-6 flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-cyan-700 text-[22px]">
                show_chart
              </span>
              <h2 className="text-base font-bold text-slate-900">Environmental Trends</h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Atmospheric pressure drop &amp; relative humidity rising past rain trigger threshold
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs overflow-x-auto">
              <button className="px-3 py-1.5 rounded-md bg-white text-cyan-800 font-bold shadow-xs transition-all whitespace-nowrap">
                Humidity &amp; Pressure
              </button>
              <button className="px-3 py-1.5 rounded-md text-slate-600 hover:text-slate-900 font-medium transition-colors whitespace-nowrap">
                Humidity Only
              </button>
              <button className="px-3 py-1.5 rounded-md text-slate-600 hover:text-slate-900 font-medium transition-colors whitespace-nowrap">
                Pressure Only
              </button>
              <button className="px-3 py-1.5 rounded-md text-slate-600 hover:text-slate-900 font-medium transition-colors whitespace-nowrap">
                Temperature
              </button>
            </div>
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button className="px-2.5 py-1.5 rounded-md text-slate-600 hover:text-slate-900 font-medium transition-colors">
                30m
              </button>
              <button className="px-2.5 py-1.5 rounded-md text-slate-600 hover:text-slate-900 font-medium transition-colors">
                1h
              </button>
              <button className="px-2.5 py-1.5 rounded-md bg-cyan-700 text-white font-bold shadow-xs transition-all">
                3h
              </button>
              <button className="px-2.5 py-1.5 rounded-md text-slate-600 hover:text-slate-900 font-medium transition-colors">
                6h
              </button>
              <button className="px-2.5 py-1.5 rounded-md text-slate-600 hover:text-slate-900 font-medium transition-colors">
                24h
              </button>
            </div>
          </div>
        </div>

        <div className="w-full bg-slate-50/80 rounded-xl border border-slate-200 p-4 relative">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3 px-2">
            <div className="flex items-center gap-5 text-xs flex-wrap">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-1 bg-cyan-600 rounded-full"></span>
                <span className="font-bold text-slate-800">Humidity (%)</span>
                <span className="text-cyan-700 font-semibold">72% → 85.1%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-1 bg-amber-600 rounded-full"></span>
                <span className="font-bold text-slate-800">Pressure (hPa)</span>
                <span className="text-amber-700 font-semibold">1010.0 → 1008.2 hPa</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-rose-700 font-medium">
              <span className="w-3 border-t-2 border-dashed border-rose-500"></span>
              <span>Rain Trigger Threshold (Humidity ≥ 75%)</span>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <svg
              className="w-full min-w-[700px] h-[220px]"
              preserveAspectRatio="none"
              viewBox="0 0 800 220"
            >
              <defs>
                <linearGradient id="humidityGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#0891b2" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0891b2" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <line stroke="#e2e8f0" strokeWidth="1" x1="50" x2="780" y1="30" />
              <line stroke="#e2e8f0" strokeWidth="1" x1="50" x2="780" y1="80" />
              <line stroke="#e2e8f0" strokeWidth="1" x1="50" x2="780" y1="130" />
              <line stroke="#e2e8f0" strokeWidth="1" x1="50" x2="780" y1="180" />

              <line
                stroke="#f43f5e"
                strokeDasharray="5 4"
                strokeWidth="1.5"
                x1="50"
                x2="780"
                y1="95"
              />
              <text fill="#e11d48" fontFamily="Inter" fontSize="10" fontWeight="600" x="55" y="90">
                THRESHOLD: 75% HUMIDITY
              </text>

              <text fill="#64748b" fontFamily="Inter" fontSize="10" textAnchor="end" x="42" y="34">
                90%
              </text>
              <text fill="#64748b" fontFamily="Inter" fontSize="10" textAnchor="end" x="42" y="84">
                80%
              </text>
              <text fill="#64748b" fontFamily="Inter" fontSize="10" textAnchor="end" x="42" y="134">
                70%
              </text>
              <text fill="#64748b" fontFamily="Inter" fontSize="10" textAnchor="end" x="42" y="184">
                60%
              </text>

              <text
                fill="#b45309"
                fontFamily="Inter"
                fontSize="10"
                textAnchor="start"
                x="785"
                y="34"
              >
                1011 hPa
              </text>
              <text
                fill="#b45309"
                fontFamily="Inter"
                fontSize="10"
                textAnchor="start"
                x="785"
                y="84"
              >
                1010 hPa
              </text>
              <text
                fill="#b45309"
                fontFamily="Inter"
                fontSize="10"
                textAnchor="start"
                x="785"
                y="134"
              >
                1009 hPa
              </text>
              <text
                fill="#b45309"
                fontFamily="Inter"
                fontSize="10"
                textAnchor="start"
                x="785"
                y="184"
              >
                1008 hPa
              </text>

              <polygon
                fill="url(#humidityGradient)"
                points="90,180 90,125 310,105 530,85 750,52 750,180"
              />
              <path
                d="M 90,125 C 200,120 220,108 310,105 C 400,102 440,88 530,85 C 620,82 660,55 750,52"
                fill="none"
                stroke="#0891b2"
                strokeLinecap="round"
                strokeWidth="3"
              />
              <path
                d="M 90,80 C 200,85 220,100 310,105 C 400,110 440,125 530,130 C 620,135 660,165 750,172"
                fill="none"
                stroke="#d97706"
                strokeLinecap="round"
                strokeWidth="3"
              />

              <circle cx="90" cy="125" fill="#ffffff" r="4.5" stroke="#0891b2" strokeWidth="2.5" />
              <circle cx="310" cy="105" fill="#ffffff" r="4.5" stroke="#0891b2" strokeWidth="2.5" />
              <circle cx="530" cy="85" fill="#ffffff" r="4.5" stroke="#0891b2" strokeWidth="2.5" />
              <circle cx="750" cy="52" fill="#0891b2" r="6" stroke="#ffffff" strokeWidth="2" />

              <circle cx="90" cy="80" fill="#ffffff" r="4.5" stroke="#d97706" strokeWidth="2.5" />
              <circle cx="310" cy="105" fill="#ffffff" r="4.5" stroke="#d97706" strokeWidth="2.5" />
              <circle cx="530" cy="130" fill="#ffffff" r="4.5" stroke="#d97706" strokeWidth="2.5" />
              <circle cx="750" cy="172" fill="#d97706" r="6" stroke="#ffffff" strokeWidth="2" />

              <text
                fill="#0e7490"
                fontFamily="Inter"
                fontSize="11"
                fontWeight="700"
                textAnchor="end"
                x="740"
                y="44"
              >
                85.1%
              </text>
              <text
                fill="#b45309"
                fontFamily="Inter"
                fontSize="11"
                fontWeight="700"
                textAnchor="end"
                x="740"
                y="195"
              >
                1008.2 hPa
              </text>

              <text
                fill="#64748b"
                fontFamily="Inter"
                fontSize="11"
                textAnchor="middle"
                x="90"
                y="208"
              >
                09:00 AM (−3h)
              </text>
              <text
                fill="#64748b"
                fontFamily="Inter"
                fontSize="11"
                textAnchor="middle"
                x="310"
                y="208"
              >
                10:00 AM (−2h)
              </text>
              <text
                fill="#64748b"
                fontFamily="Inter"
                fontSize="11"
                textAnchor="middle"
                x="530"
                y="208"
              >
                11:00 AM (−1h)
              </text>
              <text
                fill="#0f172a"
                fontFamily="Inter"
                fontSize="11"
                fontWeight="700"
                textAnchor="middle"
                x="750"
                y="208"
              >
                12:00 PM (Now)
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* SECTION 4 & 5 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SECTION 4: PREDICTION FACTORS */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-cyan-700 text-[22px]">
                  checklist
                </span>
                <h2 className="text-base font-bold text-slate-900">Prediction Factors</h2>
              </div>
              <span className="text-xs text-slate-500 font-medium">Traceable Logic</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Conditions and parameter evaluations currently contributing to the rainfall
              forecast
            </p>

            <div className="mt-4 flex flex-col gap-3">
              {/* Factor 1: Humidity */}
              <div className="p-3.5 rounded-lg border border-teal-200 bg-teal-50/50 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">water_drop</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900">Humidity Trend</span>
                      <span className="text-xs font-semibold text-teal-800">
                        85.1% (↑ Increasing)
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Humidity exceeds 75% threshold with positive delta rate (+13.1% in 3h)
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-100 border border-teal-300 text-teal-900 text-[11px] font-bold shrink-0">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  Supporting condition
                </span>
              </div>

              {/* Factor 2: Pressure Drop */}
              <div className="p-3.5 rounded-lg border border-teal-200 bg-teal-50/50 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">trending_down</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900">
                        Barometric Pressure
                      </span>
                      <span className="text-xs font-semibold text-amber-800">
                        −1.8 hPa / 3h (↓ Falling)
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Rapid depression exceeding −1.5 hPa/3h trigger indicates inbound
                      low-pressure system
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-100 border border-teal-300 text-teal-900 text-[11px] font-bold shrink-0">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  Supporting condition
                </span>
              </div>

              {/* Factor 3: Temperature */}
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/80 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">thermostat</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900">
                        Ambient Temperature
                      </span>
                      <span className="text-xs font-semibold text-slate-700">
                        21.4 °C (Stable)
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Nominal temperature gradient; no cold or thermal front detected
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200/80 border border-slate-300 text-slate-700 text-[11px] font-semibold shrink-0">
                  <span className="material-symbols-outlined text-[14px]">remove</span>
                  Neutral condition
                </span>
              </div>

              {/* Factor 4: Rain Sensor Base */}
              <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/80 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[18px]">water_ec</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-slate-900">
                        Current Precipitation
                      </span>
                      <span className="text-xs font-semibold text-slate-700">
                        No rain detected
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Surface optical rain sensors confirm dry baseline (pre-precipitation phase)
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-200/80 border border-slate-300 text-slate-700 text-[11px] font-semibold shrink-0">
                  <span className="material-symbols-outlined text-[14px]">remove</span>
                  Neutral condition
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
            <span>
              Tag Legend: <strong className="text-teal-700">Supporting</strong> (Rain indicator),{" "}
              <strong className="text-slate-600">Neutral</strong> (No impact),{" "}
              <strong className="text-rose-700">Opposing</strong> (Inhibits rain)
            </span>
            <span className="font-semibold text-slate-700">
              2 Supporting • 2 Neutral • 0 Opposing
            </span>
          </div>
        </div>

        {/* SECTION 5: PREDICTION THRESHOLDS */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 shadow-xs p-4 sm:p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-cyan-700 text-[22px]">tune</span>
                <h2 className="text-base font-bold text-slate-900">Prediction Thresholds</h2>
              </div>
              <span className="text-xs font-semibold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                Configurable
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Define trigger thresholds for rain prediction calculations
            </p>

            <div className="mt-4 flex flex-col gap-4">
              {/* Rule 1: Humidity Threshold */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col gap-2">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <label className="text-xs font-bold text-slate-900" htmlFor="humidity-thresh">
                    Humidity Threshold
                  </label>
                  <span className="text-[11px] text-teal-700 font-semibold bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                    Currently Triggered (85.1%)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    className="w-24 h-9 px-3 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:border-cyan-600"
                    id="humidity-thresh"
                    type="number"
                    defaultValue={75}
                  />
                  <span className="text-xs font-bold text-slate-600">% RH</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Trigger condition: Air relative humidity ≥ threshold
                </p>
              </div>

              {/* Rule 2: Pressure Drop */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col gap-2">
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <label className="text-xs font-bold text-slate-900" htmlFor="pressure-thresh">
                    Barometric Pressure Drop
                  </label>
                  <span className="text-[11px] text-amber-800 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    Currently Triggered (−1.8 hPa)
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <input
                      className="w-full h-9 px-3 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:border-cyan-600"
                      id="pressure-thresh"
                      step="0.1"
                      type="number"
                      defaultValue={1.5}
                    />
                    <span className="text-xs font-medium text-slate-600">hPa</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">over</span>
                    <input
                      className="w-full h-9 px-3 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:border-cyan-600"
                      id="period-hours"
                      type="number"
                      defaultValue={3}
                    />
                    <span className="text-xs font-medium text-slate-600">hrs</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500">
                  Trigger condition: Pressure drop ≥ threshold within selected period
                </p>
              </div>

              {/* Rule 3: Prediction Window */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-900" htmlFor="prediction-window">
                  Prediction Forecast Window
                </label>
                <div className="flex items-center gap-2">
                  <input
                    className="w-24 h-9 px-3 bg-white border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:border-cyan-600"
                    id="prediction-window"
                    type="number"
                    defaultValue={3}
                  />
                  <span className="text-xs font-medium text-slate-600">
                    hours forward projection
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Evaluates trend rate of change across this duration
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-[11px] text-slate-400">
              Settings apply to all selected mesh stations
            </span>
            <button
              className="h-9 px-4 rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white font-semibold text-xs transition-colors shadow-xs flex items-center gap-1.5 justify-center"
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">save</span>
              <span>Save Thresholds</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 6: RECENT PREDICTIONS HISTORY */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1 bg-white">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent Predictions History</h3>
            <p className="text-xs text-slate-500">
              Log of atmospheric assessments and verified trigger conditions
            </p>
          </div>
          <span className="text-xs text-slate-500">Logged every 3 hours</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold select-none">
              <tr>
                <th className="py-3 px-4 w-28">Time</th>
                <th className="py-3 px-4 w-44">Prediction</th>
                <th className="py-3 px-4 w-36">Confidence</th>
                <th className="py-3 px-4">Triggering Conditions</th>
                <th className="py-3 px-4 text-right w-24">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              <tr className="bg-cyan-50/20 hover:bg-cyan-50/40 transition-colors">
                <td className="py-3.5 px-4 font-bold text-slate-900">12:00 PM</td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span>
                    Rain Likely
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">78%</span>
                    <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: "78%" }} />
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-slate-700">
                  High humidity (&gt;85%) + Rapid barometric pressure drop (−1.8 hPa / 3h)
                </td>
                <td className="py-3.5 px-4 text-right">
                  <span className="inline-flex items-center text-[11px] font-semibold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded">
                    In Progress
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3.5 px-4 font-medium text-slate-800">09:00 AM</td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    Rain Unlikely
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-700">24%</span>
                    <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-slate-400 h-1.5 rounded-full" style={{ width: "24%" }} />
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-slate-600">
                  Pressure stable (1011.2 hPa), Humidity moderate (62%)
                </td>
                <td className="py-3.5 px-4 text-right">
                  <span className="inline-flex items-center text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Accurate (Dry)
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="py-3.5 px-4 font-medium text-slate-800">06:00 AM</td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    Rain Unlikely
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-700">18%</span>
                    <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-slate-400 h-1.5 rounded-full" style={{ width: "18%" }} />
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-slate-600">
                  Normal diurnal baseline, no pressure gradient
                </td>
                <td className="py-3.5 px-4 text-right">
                  <span className="inline-flex items-center text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Accurate (Dry)
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-cyan-700">history</span>
            <span>
              Displaying historical 3-hour cycle predictions from local station telemetry
            </span>
          </div>
          <button className="text-cyan-800 font-semibold hover:underline" type="button">
            View Full Archive
          </button>
        </div>
      </div>
    </div>
  );
}
