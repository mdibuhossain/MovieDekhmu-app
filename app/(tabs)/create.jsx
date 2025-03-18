import { View } from "react-native";
import { useState } from "react";
import { Button, Form, Input, Label, ScrollView, Select, Spinner, XStack, YStack } from "tamagui";
import CustomInpurField from "../../components/CustomInpurField";
import { useDispatch } from "react-redux";

const Create = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  

  const submitHandler = () => [
    setIsLoading(true),
    setTimeout(() => {
      setIsLoading(false);
    }, 1000),
  ]

  return (
    <View className="bg-primary flex-1 items-center">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Form
          onSubmit={submitHandler}
        >
          {/* <CustomInpurField
            label="Title"
          /> */}
          <YStack >
            <Label htmlFor="title" color="white">
              Movie title
            </Label>
            <Input id="title" minWidth="100%" backgroundColor="transparent" color="white" />
          </YStack>
          <YStack>
            <Label htmlFor="origin" color="white">
              Origin
            </Label>
            <Input id="origin" minWidth="100%" backgroundColor="transparent" color="white" />
          </YStack>
          <YStack>
            <Label htmlFor="type" color="white">
              Type
            </Label>
            <Input id="type" minWidth="100%" backgroundColor="transparent" color="white" />
          </YStack>
          <YStack>
            <Label htmlFor="year" color="white">
              Year
            </Label>
            <Input id="year" minWidth="100%" backgroundColor="transparent" color="white" />
          </YStack>
          <YStack>
            <Label htmlFor="review" color="white">
              Review
            </Label>
            <Input id="review" minWidth="100%" backgroundColor="transparent" color="white" />
          </YStack>
         
          <Form.Trigger asChild disabled={isLoading} className="my-5">
            <Button icon={isLoading ? () => <Spinner /> : null} className="bg-secondary text-white">
              Submit
            </Button>
          </Form.Trigger>
        </Form>
      </ScrollView>
    </View>
  );
};

export default Create;
