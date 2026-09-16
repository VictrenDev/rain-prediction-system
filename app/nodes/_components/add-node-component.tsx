"use client";

import { useState } from "react";

export default function AddNodeButton() {
  const [showAddNode, setShowAddNode] = useState(false);

  return (
    <>
      <button
        className="h-9 px-3.5 rounded-lg bg-cyan-700 hover:bg-cyan-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
        type="button"
        onClick={() => setShowAddNode(true)}
      >
        <span className="material-symbols-outlined text-[18px]">add</span>

        <span>Add Node</span>
      </button>
      {showAddNode && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowAddNode(false);
            }
          }}
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700">
                    <span className="material-symbols-outlined text-[20px]">sensors</span>
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-slate-900">Add Sensor Node</h2>
                    <p className="text-xs text-slate-500">Register a new monitoring node</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAddNode(false)}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Form */}
            <div className="max-h-[75vh] overflow-y-auto px-5 py-5 sm:px-6">
              <div className="space-y-5">
                {/* Node Information */}
                <section>
                  <div className="mb-3">
                    <h3 className="text-sm font-bold text-slate-900">Node Information</h3>
                    <p className="text-xs text-slate-500">Basic details used to identify this node.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="node-name" className="mb-1.5 block text-xs font-semibold text-slate-700">
                        Node Name
                      </label>

                      <input
                        id="node-name"
                        type="text"
                        placeholder="e.g. Node 3"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                      />
                    </div>

                    <div>
                      <label htmlFor="node-id" className="mb-1.5 block text-xs font-semibold text-slate-700">
                        Node ID
                      </label>

                      <input
                        id="node-id"
                        type="text"
                        placeholder="e.g. node-03"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label htmlFor="node-location" className="mb-1.5 block text-xs font-semibold text-slate-700">
                        Location
                      </label>

                      <input
                        id="node-location"
                        type="text"
                        placeholder="e.g. East Garden"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                      />
                    </div>
                  </div>
                </section>

                {/* MQTT */}
                <section className="border-t border-slate-100 pt-5">
                  <div className="mb-3">
                    <h3 className="text-sm font-bold text-slate-900">MQTT Connection</h3>
                    <p className="text-xs text-slate-500">Topic used by the node to publish sensor readings.</p>
                  </div>

                  <div>
                    <label htmlFor="mqtt-topic" className="mb-1.5 block text-xs font-semibold text-slate-700">
                      MQTT Topic
                    </label>

                    <input
                      id="mqtt-topic"
                      type="text"
                      placeholder="sensors/hydro/node-03"
                      className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 font-mono text-xs text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100"
                    />
                  </div>
                </section>


                {/* Configuration */}
                <section className="border-t border-slate-100 pt-5">
                  <div className="mb-3">
                    <h3 className="text-sm font-bold text-slate-900">Node Configuration</h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="power-source" className="mb-1.5 block text-xs font-semibold text-slate-700">
                        Power Source
                      </label>

                      <select
                        id="power-source"
                        defaultValue="LiPo"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                      >
                        <option value="LiPo">LiPo Battery</option>
                        <option value="AC Mains">AC Mains</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="data-interval" className="mb-1.5 block text-xs font-semibold text-slate-700">
                        Data Interval
                      </label>

                      <select
                        id="data-interval"
                        defaultValue="3"
                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100"
                      >
                        <option value="30">30 seconds</option>
                        <option value="60">1 minute</option>
                        <option value="3">3 minutes</option>
                        <option value="5">5 minutes</option>
                        <option value="10">10 minutes</option>
                      </select>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
              <button
                type="button"
                onClick={() => setShowAddNode(false)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  // Connect this to your API/database later.
                  setShowAddNode(false);
                }}
                className="rounded-lg bg-cyan-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cyan-800"
              >
                Add Node
              </button>
            </div>
          </div>
        </div>
      )}
   </>
  );
}
