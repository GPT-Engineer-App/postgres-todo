import { useState, useEffect } from "react";
import { Box, Heading, Input, Button, Flex, Text, IconButton, VStack, HStack, Spacer, useToast } from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";

const Index = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const toast = useToast();

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch("/api/todos");
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const addTodo = async () => {
    if (newTodo.trim() !== "") {
      try {
        const response = await fetch("/api/todos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: newTodo }),
        });
        const data = await response.json();
        setTodos([...todos, data]);
        setNewTodo("");
        toast({
          title: "Todo added.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });
      setTodos(todos.filter((todo) => todo.id !== id));
      toast({
        title: "Todo deleted.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <Box maxWidth="400px" margin="auto" mt={8}>
      <Heading mb={8}>Todo App</Heading>
      <Flex mb={4}>
        <Input value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder="Enter a new todo" mr={2} />
        <Button onClick={addTodo} colorScheme="blue">
          <FaPlus />
        </Button>
      </Flex>
      <VStack spacing={4} align="stretch">
        {todos.map((todo) => (
          <HStack key={todo.id}>
            <Text>{todo.title}</Text>
            <Spacer />
            <IconButton icon={<FaTrash />} onClick={() => deleteTodo(todo.id)} colorScheme="red" size="sm" />
          </HStack>
        ))}
      </VStack>
    </Box>
  );
};

export default Index;
