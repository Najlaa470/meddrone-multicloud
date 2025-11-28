"use client";

import { useEffect, useState } from "react";

type Gravite = "critique" | "urgent" | "modere";

type IncidentPolicies = {
  slaMinutes: {
    critique: number;
    urgent: number;
    modere: number;
  };
  autoDroneFor: Gravite[]; // niveaux qui déclenchent automatiquement un drone
};

type FleetPolicies = {
  minBatteryToStart: number; // % minimum pour lancer un drone
  maxDronesSimultanes: number;
  backupDroneIfEtaAbove: number; // minutes avant envoi d’un drone de secours
};

type AlertPolicies = {
  enableSoundAlerts: boolean;
  criticalEscalationMinutes: number;
  notifyMedChief: boolean;
  notifySecurityChief: boolean;
  notifyOpsDirector: boolean;
};

type ZonePolicies = {
  highRiskZones: string; // liste de zones séparées par des virgules
};

type FullConfig = {
  incidentPolicies: IncidentPolicies;
  fleetPolicies: FleetPolicies;
  alertPolicies: AlertPolicies;
  zonePolicies: ZonePolicies;
};

const STORAGE_KEY = "meddrone_advanced_config";

const defaultConfig: FullConfig = {
  incidentPolicies: {
    slaMinutes: {
      critique: 5,
      urgent: 10,
      modere: 20,
    },
    autoDroneFor: ["critique", "urgent"],
  },
  fleetPolicies: {
    minBatteryToStart: 40,
    maxDronesSimultanes: 4,
    backupDroneIfEtaAbove: 8,
  },
  alertPolicies: {
    enableSoundAlerts: true,
    criticalEscalationMinutes: 3,
    notifyMedChief: true,
    notifySecurityChief: true,
    notifyOpsDirector: false,
  },
  zonePolicies: {
    highRiskZones: "Terrain, Zone VIP, Tribune Centrale",
  },
};

export default function ParametragePlateforme() {
  const [config, setConfig] = useState<FullConfig>(defaultConfig);
  const [message, setMessage] = useState("");

  // Charger depuis localStorage au démarrage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as FullConfig;
        setConfig(parsed);
      }
    } catch {
      // On ignore les erreurs de parsing et on garde le défaut
    }
  }, []);

  const saveConfig = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    setMessage("✅ Paramètres enregistrés pour cette plateforme (navigateur actuel).");
    setTimeout(() => setMessage(""), 3000);
  };

  const toggleAutoDrone = (gravite: Gravite) => {
    setConfig((prev) => {
      const current = prev.incidentPolicies.autoDroneFor;
      const exists = current.includes(gravite);
      const next = exists ? current.filter((g) => g !== gravite) : [...current, gravite];
      return {
        ...prev,
        incidentPolicies: {
          ...prev.incidentPolicies,
          autoDroneFor: next,
        },
      };
    });
  };

  return (
    <div className="space-y-5 text-sm">
      <h1 className="text-base font-semibold">Paramétrage de la qualité de service</h1>

      <p className="text-xs text-slate-400">
        Cette page permet d’ajuster le comportement de la plateforme MedDrone pour
        améliorer la qualité des interventions et la gestion opérationnelle, sans
        entrer dans les détails techniques du cloud.
      </p>

      {/* Bloc 1 : Règles d’intervention */}
      <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900 p-4 text-xs">
        <h2 className="text-sm font-semibold">1. Règles d’intervention par gravité</h2>
        <p className="text-[11px] text-slate-400">
          Définissez les objectifs de temps d’arrivée du drone et les niveaux qui
          déclenchent automatiquement une intervention par drone.
        </p>

        <div className="grid gap-3 md:grid-cols-3">
          <SlaInput
            label="Cas critiques"
            value={config.incidentPolicies.slaMinutes.critique}
            onChange={(value) =>
              setConfig((prev) => ({
                ...prev,
                incidentPolicies: {
                  ...prev.incidentPolicies,
                  slaMinutes: {
                    ...prev.incidentPolicies.slaMinutes,
                    critique: value,
                  },
                },
              }))
            }
          />
          <SlaInput
            label="Cas urgents"
            value={config.incidentPolicies.slaMinutes.urgent}
            onChange={(value) =>
              setConfig((prev) => ({
                ...prev,
                incidentPolicies: {
                  ...prev.incidentPolicies,
                  slaMinutes: {
                    ...prev.incidentPolicies.slaMinutes,
                    urgent: value,
                  },
                },
              }))
            }
          />
          <SlaInput
            label="Cas modérés"
            value={config.incidentPolicies.slaMinutes.modere}
            onChange={(value) =>
              setConfig((prev) => ({
                ...prev,
                incidentPolicies: {
                  ...prev.incidentPolicies,
                  slaMinutes: {
                    ...prev.incidentPolicies.slaMinutes,
                    modere: value,
                  },
                },
              }))
            }
          />
        </div>

        <div className="mt-3 space-y-1">
          <p className="text-[11px] font-semibold text-slate-300">
            Niveaux déclenchant automatiquement l’envoi d’un drone :
          </p>
          <div className="flex flex-wrap gap-2">
            <AutoDroneChip
              label="Critique"
              active={config.incidentPolicies.autoDroneFor.includes("critique")}
              onClick={() => toggleAutoDrone("critique")}
            />
            <AutoDroneChip
              label="Urgent"
              active={config.incidentPolicies.autoDroneFor.includes("urgent")}
              onClick={() => toggleAutoDrone("urgent")}
            />
            <AutoDroneChip
              label="Modéré"
              active={config.incidentPolicies.autoDroneFor.includes("modere")}
              onClick={() => toggleAutoDrone("modere")}
            />
          </div>
        </div>
      </section>

      {/* Bloc 2 : Politique de flotte */}
      <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900 p-4 text-xs">
        <h2 className="text-sm font-semibold">2. Politique de flotte de drones</h2>
        <p className="text-[11px] text-slate-400">
          Ces paramètres influencent la manière dont la flotte de drones est utilisée
          pour garantir un bon niveau de service tout en protégeant le matériel.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1">
            <label className="block text-[11px] text-slate-300">
              Batterie minimale pour lancer un drone
            </label>
            <input
              type="range"
              min={20}
              max={100}
              value={config.fleetPolicies.minBatteryToStart}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  fleetPolicies: {
                    ...prev.fleetPolicies,
                    minBatteryToStart: Number(e.target.value),
                  },
                }))
              }
              className="w-full"
            />
            <p className="text-[11px] text-emerald-400">
              {config.fleetPolicies.minBatteryToStart}% minimum
            </p>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] text-slate-300">
              Drones en mission simultanés (max)
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={config.fleetPolicies.maxDronesSimultanes}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  fleetPolicies: {
                    ...prev.fleetPolicies,
                    maxDronesSimultanes: Number(e.target.value),
                  },
                }))
              }
              className="w-20 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-[11px]"
            />
            <p className="text-[11px] text-slate-500">
              Permet de limiter la charge de la flotte.
            </p>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] text-slate-300">
              Envoi d’un drone de secours si ETA &gt; (minutes)
            </label>
            <input
              type="number"
              min={3}
              max={30}
              value={config.fleetPolicies.backupDroneIfEtaAbove}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  fleetPolicies: {
                    ...prev.fleetPolicies,
                    backupDroneIfEtaAbove: Number(e.target.value),
                  },
                }))
              }
              className="w-24 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-[11px]"
            />
            <p className="text-[11px] text-slate-500">
              Au-delà de ce délai, un second drone peut être mobilisé.
            </p>
          </div>
        </div>
      </section>

      {/* Bloc 3 : Alerte & escalade */}
      <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900 p-4 text-xs">
        <h2 className="text-sm font-semibold">3. Alertes et escalade</h2>
        <p className="text-[11px] text-slate-400">
          Configurez les alertes visuelles/sonores et la manière dont les incidents
          critiques sont remontés aux responsables.
        </p>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-[11px] text-slate-300">
            <input
              type="checkbox"
              checked={config.alertPolicies.enableSoundAlerts}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  alertPolicies: {
                    ...prev.alertPolicies,
                    enableSoundAlerts: e.target.checked,
                  },
                }))
              }
            />
            Activer une alerte sonore pour les incidents urgents et critiques
          </label>

          <div className="space-y-1 mt-2">
            <label className="block text-[11px] text-slate-300">
              Temps avant escalade d’un incident critique non pris en charge
            </label>
            <input
              type="number"
              min={1}
              max={15}
              value={config.alertPolicies.criticalEscalationMinutes}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  alertPolicies: {
                    ...prev.alertPolicies,
                    criticalEscalationMinutes: Number(e.target.value),
                  },
                }))
              }
              className="w-24 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-[11px]"
            />
            <p className="text-[11px] text-slate-500">
              Au-delà de ce délai, l’incident est marqué comme &quot;à risque&quot; dans le
              tableau de bord.
            </p>
          </div>

          <div className="mt-2 space-y-1">
            <p className="text-[11px] font-semibold text-slate-300">
              Responsables à notifier :
            </p>
            <div className="flex flex-wrap gap-3">
              <NotifyCheckbox
                label="Médecin chef"
                checked={config.alertPolicies.notifyMedChief}
                onChange={(checked) =>
                  setConfig((prev) => ({
                    ...prev,
                    alertPolicies: {
                      ...prev.alertPolicies,
                      notifyMedChief: checked,
                    },
                  }))
                }
              />
              <NotifyCheckbox
                label="Responsable sécurité"
                checked={config.alertPolicies.notifySecurityChief}
                onChange={(checked) =>
                  setConfig((prev) => ({
                    ...prev,
                    alertPolicies: {
                      ...prev.alertPolicies,
                      notifySecurityChief: checked,
                    },
                  }))
                }
              />
              <NotifyCheckbox
                label="Direction opérationnelle"
                checked={config.alertPolicies.notifyOpsDirector}
                onChange={(checked) =>
                  setConfig((prev) => ({
                    ...prev,
                    alertPolicies: {
                      ...prev.alertPolicies,
                      notifyOpsDirector: checked,
                    },
                  }))
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* Bloc 4 : Zones sensibles */}
      <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900 p-4 text-xs">
        <h2 className="text-sm font-semibold">4. Zones sensibles du stade</h2>
        <p className="text-[11px] text-slate-400">
          Indiquez les zones considérées comme prioritaires (ex. : Terrain, Zone VIP,
          Tribune Centrale). Elles pourront être traitées en priorité par la
          plateforme.
        </p>

        <textarea
          value={config.zonePolicies.highRiskZones}
          onChange={(e) =>
            setConfig((prev) => ({
              ...prev,
              zonePolicies: {
                ...prev.zonePolicies,
                highRiskZones: e.target.value,
              },
            }))
          }
          className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2 text-[11px] min-h-[60px]"
          placeholder="Exemples : Terrain, Zone VIP, Tribune Centrale..."
        />
        <p className="text-[11px] text-slate-500">
          Séparez les zones par des virgules. Cette information pourra être utilisée
          pour prioriser les incidents dans ces zones.
        </p>
      </section>

      <button
        onClick={saveConfig}
        className="w-full rounded-xl bg-emerald-500 px-3 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
      >
        💾 Enregistrer les paramètres de la plateforme
      </button>

      {message && (
        <p className="text-[11px] text-emerald-400 mt-1">
          {message}
        </p>
      )}
    </div>
  );
}

/* Sous-composants */

type SlaInputProps = {
  label: string;
  value: number;
  onChange: (v: number) => void;
};

function SlaInput({ label, value, onChange }: SlaInputProps) {
  return (
    <div className="space-y-1">
      <label className="block text-[11px] text-slate-300">
        Délai cible – {label}
      </label>
      <input
        type="number"
        min={1}
        max={60}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-24 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-[11px]"
      />
      <p className="text-[11px] text-slate-500">Minutes</p>
    </div>
  );
}

type ChipProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

function AutoDroneChip({ label, active, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-full px-3 py-1 text-[11px] border " +
        (active
          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/60"
          : "bg-slate-900 text-slate-300 border-slate-600")
      }
    >
      {label}
    </button>
  );
}

type NotifyProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function NotifyCheckbox({ label, checked, onChange }: NotifyProps) {
  return (
    <label className="flex items-center gap-2 text-[11px] text-slate-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}
