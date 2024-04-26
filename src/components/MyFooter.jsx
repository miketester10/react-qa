function MyFooter() {
  return (
    <footer className="text-lg-left">
      <div
        className="text-end p-3"
        
      >
        &copy; {new Date().getFullYear()} Copyright: Mike
        {/* <a className="text-dark" href="https://example.com/">
          YourWebsite.com
        </a> */}
      </div>
    </footer>
  );
}

export default MyFooter;
