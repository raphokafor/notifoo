const FooterComp = () => {
  return (
    <div>
      {/* Footer */}
      <footer className="bg-muted/30 py-12 px-4">
        <div className="container mx-auto">
          <div className="border-t border-border mt-8 pt-20 text-center text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} Notifoo. All rights reserved.
              We'll remind you to check back later.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FooterComp;
