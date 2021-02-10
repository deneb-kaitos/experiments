<style>
  section {
    display: flex;
    justify-content: center;
    align-items: center;

    height: 8vh;
    width: 20vw;
    padding: 0 1vw;

    transform: translate(0, -8vh);
    background-color: hsl(17deg 98% 36%);
  }

  section > div {
    grid-area: askPermissionsText;
    padding: 1vh 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    font-size: 1.25rem;
    color: hsl(0deg 0% 96%);
  }
</style>

<section class='roundedCorners'>
  <div><slot></slot></div>
</section>
