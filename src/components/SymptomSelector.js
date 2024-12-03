{증상.map((증상, index) => (
  <div key={index}>
    {typeof 증상 === 'object' ? 증상.name : 증상}
  </div>
))}
