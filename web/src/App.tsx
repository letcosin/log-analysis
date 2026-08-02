import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { BarChart, Bar, CartesianGrid, LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'

type ApiLog = {
  id: string
  level: LogLevel
  timestamp: string
  message: string
}

type LogsResponse = {
  data: ApiLog[]
  total: number
  page: number
  limit: number
  totalPages: number
}

type StatItem = {
  level: string
  count: string
}

type TimelineItem = {
  period: string
  count: string | number
}

type StatsResponse = {
  total: number
  byLevel: StatItem[]
  timeline: TimelineItem[]
}

type TrendItem = {
  period: string
  count: number
}

const levels: LogLevel[] = ['INFO', 'WARN', 'ERROR', 'DEBUG']
const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api').replace(/\/$/, '')

const formatDate = (value: string) => {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date)
}

const formatHour = (value: string) => {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url)

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || 'Request failed')
  }

  return response.json() as Promise<T>
}

function App() {
  const [selectedLevel, setSelectedLevel] = useState('ALL')
  const [search, setSearch] = useState('')
  const [logs, setLogs] = useState<ApiLog[]>([])
  const [totalLogs, setTotalLogs] = useState(0)
  const [chartData, setChartData] = useState<{ period: string; total: number }[]>([])
  const [trendData, setTrendData] = useState<TrendItem[]>([])
  const [totalByLevel, setTotalByLevel] = useState<{ name: string; value: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const loadData = async () => {
    const params = new URLSearchParams()

    if (selectedLevel !== 'ALL') {
      params.set('level', selectedLevel)
    }

    if (search.trim()) {
      params.set('search', search.trim())
    }

    if (startDate) {
      params.set('startDate', startDate)
    }

    if (endDate) {
      params.set('endDate', endDate)
    }

    setLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const [logsResponse, statsResponse, trendsResponse] = await Promise.all([
        fetchJson<LogsResponse>(`${API_URL}/logs?${params.toString()}`),
        fetchJson<StatsResponse>(`${API_URL}/logs/stats`),
        fetchJson<TrendItem[]>(`${API_URL}/dashboard/trends`),
      ])

      setLogs(logsResponse.data ?? [])
      setTotalLogs(logsResponse.total ?? 0)

      const levelMap = new Map<string, number>()
      ;(statsResponse.byLevel ?? []).forEach((item) => {
        levelMap.set(item.level, Number(item.count ?? 0))
      })

      const nextTotalByLevel = levels.map((level) => ({
        name: level,
        value: levelMap.get(level) ?? 0,
      }))

      const nextChartData = (statsResponse.timeline ?? []).map((entry) => ({
        period: formatHour(entry.period),
        total: Number(entry.count ?? 0),
      }))

      setChartData(nextChartData)
      setTrendData(trendsResponse ?? [])
      setTotalByLevel(nextTotalByLevel)
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Erro ao carregar os dados da API.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadData()
  }, [search, selectedLevel, startDate, endDate])

  const maxLevelValue = useMemo(
    () => Math.max(...totalByLevel.map((entry) => entry.value), 1),
    [totalByLevel],
  )

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    setImporting(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await fetch(`${API_URL}/logs/import`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        const message = payload?.error || payload?.message || 'Erro ao importar o arquivo.'
        throw new Error(message)
      }

      const payload = (await response.json()) as { imported: number; ignored: number; durationMs: number }

      setSearch('')
      setSelectedLevel('ALL')
      setStartDate('')
      setEndDate('')
      event.target.value = ''
      setSuccessMessage(`Arquivo importado com sucesso! ${payload.imported} registros importados, ${payload.ignored} ignorados em ${payload.durationMs}ms.`)
      await loadData()
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : 'Não foi possível importar o arquivo.')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Log Analysis</p>
            <h1 className="mt-2 text-3xl font-bold text-white">Application log dashboard</h1>
          </div>

          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".log,.txt"
              onChange={handleImport}
            />
            <button
              type="button"
              disabled={importing}
              onClick={() => fileInputRef.current?.click()}
              className="rounded-lg bg-cyan-500 px-4 py-2 font-medium text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {importing ? 'Importando...' : 'Importar arquivo de logs'}
            </button>
          </div>
        </header>

        {error ? (
          <div className="mb-6 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ) : null}

        {successMessage ? (
          <div className="mb-6 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {successMessage}
          </div>
        ) : null}

        <section className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Total logs</p>
            <p className="mt-3 text-3xl font-bold text-white">{loading ? '...' : totalLogs}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Errors</p>
            <p className="mt-3 text-3xl font-bold text-red-400">{loading ? '...' : totalByLevel.find((item) => item.name === 'ERROR')?.value ?? 0}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Warnings</p>
            <p className="mt-3 text-3xl font-bold text-amber-400">{loading ? '...' : totalByLevel.find((item) => item.name === 'WARN')?.value ?? 0}</p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <p className="text-sm text-slate-400">Info</p>
            <p className="mt-3 text-3xl font-bold text-emerald-400">{loading ? '...' : totalByLevel.find((item) => item.name === 'INFO')?.value ?? 0}</p>
          </div>
        </section>

        <section className="mb-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Log volume by hour</h2>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="period" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="total" fill="#2dd4bf" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
            <h2 className="mb-4 text-lg font-semibold text-white">Distribution by level</h2>
            <div className="space-y-4">
              {totalByLevel.map((item) => (
                <div key={item.name}>
                  <div className="mb-1 flex items-center justify-between text-sm text-slate-300">
                    <span>{item.name}</span>
                    <span>{item.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800">
                    <div
                      className="h-2 rounded-full bg-cyan-400"
                      style={{ width: `${(item.value / maxLevelValue) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Trend over time</h2>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="period" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#38bdf8" strokeWidth={3} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-semibold text-white">Registered logs</h2>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <select
                value={selectedLevel}
                onChange={(event) => setSelectedLevel(event.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none"
              >
                <option value="ALL">All levels</option>
                {levels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>

              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none"
              />

              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search messages"
                className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-400">
                <tr>
                  <th className="px-3 py-2 font-medium">Timestamp</th>
                  <th className="px-3 py-2 font-medium">Level</th>
                  <th className="px-3 py-2 font-medium">Message</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} className="px-3 py-6 text-center text-slate-400">
                      Loading logs...
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-3 py-6 text-center text-slate-400">
                      No logs found.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="border-t border-slate-800 text-slate-200">
                      <td className="px-3 py-3">{formatDate(log.timestamp)}</td>
                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            log.level === 'ERROR'
                              ? 'bg-red-500/15 text-red-300'
                              : log.level === 'WARN'
                                ? 'bg-amber-500/15 text-amber-300'
                                : log.level === 'DEBUG'
                                  ? 'bg-blue-500/15 text-blue-300'
                                  : 'bg-emerald-500/15 text-emerald-300'
                          }`}
                        >
                          {log.level}
                        </span>
                      </td>
                      <td className="px-3 py-3">{log.message}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
