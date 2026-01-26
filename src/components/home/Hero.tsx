export default function Hero() {
  return (
    <section className="bg-hero-gradient py-20 text-center md:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
          Understand more,{" "}
          <span className="text-gradient block sm:inline">
            read less.
          </span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
          Transform long articles, documents, or URLs into concise, actionable
          insights in seconds using advanced AI.
        </p>
      </div>
    </section>
  );
}
