function BackgroundAnimation() {

  const particles =
    Array.from(
      { length: 40 }
    );

  return (
    <div className="background-animation">

      {particles.map(
        (_, index) => (
          <span
            key={index}
            style={{
              left:
                Math.random() *
                  100 +
                "%",

              animationDuration:
                8 +
                Math.random() *
                  10 +
                "s",

              animationDelay:
                Math.random() *
                  5 +
                "s",
            }}
          />
        )
      )}

    </div>
  );
}

export default BackgroundAnimation;