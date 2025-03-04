import InputForm from "./components/InputForm";

export default function Home() {
  return (
    <main className="flex-col p-4">
      <h1 className="text-4xl text-center font-bold mb-8 mt-4">
        Band Shirt Generator
      </h1>
      <div className="max-w-screen-md w-full mx-auto">
        <InputForm />
      </div>
    </main>
  );
}
