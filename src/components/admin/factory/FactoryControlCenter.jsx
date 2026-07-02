function NotConnected() {
  return <p>Not connected yet</p>
}

export default function FactoryControlCenter() {
  return (
    <section>
      <h2 style={{ color: '#ff3b3b' }}>Factory Control Center</h2>

      <section>
        <h3>Factory Status</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Registered Engines</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Running Jobs</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Completed Jobs</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Failed Jobs</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Warnings</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Duplicates</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Pending Queue</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Processing Time</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Last Synchronization</h3>
        <NotConnected />
      </section>

      <section>
        <h3>Next Scheduled Run</h3>
        <NotConnected />
      </section>
    </section>
  )
}
