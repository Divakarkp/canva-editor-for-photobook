function PageStrip({ pages, setPage, current }) {

  return (
    <div className="pages">

      {pages.map((p,i)=>(
        <div
          key={i}
          className={current===i?"page active":"page"}
          onClick={()=>setPage(i)}
        >
          Page {i+1}
        </div>
      ))}

    </div>
  );
}

export default PageStrip;