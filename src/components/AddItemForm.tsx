import {useState} from "react";

type AddItemFormProps = {
    onAdd: (name: string, quantity: number) => void;
};

export default function AddItemForm({ onAdd }: AddItemFormProps) {
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(0);


    function handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        onAdd(name,quantity);
        setName("");
        setQuantity(0);
    }


return (
    <form onSubmit={handleSubmit}>
        <input
            type="text"
            placeholder="item name"
            value={name}
            onChange={(e) => setName(e.target.value)}
        />
        <input
        type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <button type="submit">Add Item</button>
        

    </form>
)

}