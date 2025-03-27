import { View } from "react-native";
import { useState } from "react";
import {
  Button,
  Form,
  Input,
  Label,
  ScrollView,
  Spinner,
  YStack,
} from "tamagui";
import { useDispatch } from "react-redux";
import { Dropdown } from "../../components/Dropdown";

const Create = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const submitHandler = () => [
    setIsLoading(true),
    setTimeout(() => {
      setIsLoading(false);
    }, 1000),
  ];

  return (
    <View className="bg-primary flex-1 items-center px-2">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Form onSubmit={submitHandler}>
          {/* <CustomInpurField
            label="Title"
          /> */}
          <YStack>
            <Label htmlFor="title" color="white">
              Movie title
            </Label>
            <Input
              id="title"
              minWidth="100%"
              backgroundColor="transparent"
              color="white"
            />
          </YStack>
          <View className="flex-row w-full">
            <YStack className="flex-1 mr-2">
              <Label htmlFor="year" color="white">
                Year
              </Label>
              <Dropdown color="white" backgroundColor="transparent" />
            </YStack>
            <YStack className="flex-1">
              <Label htmlFor="origin" color="white">
                Origin
              </Label>
              <Dropdown color="white" backgroundColor="transparent" />
            </YStack>
          </View>
          <YStack>
            <Label htmlFor="review" color="white">
              Review
            </Label>
            <Input
              id="review"
              minWidth="100%"
              backgroundColor="transparent"
              color="white"
            />
          </YStack>

          <Form.Trigger asChild disabled={isLoading} className="my-5">
            <Button
              icon={isLoading ? () => <Spinner /> : null}
              className="bg-secondary text-white"
            >
              Submit
            </Button>
          </Form.Trigger>
        </Form>
      </ScrollView>
    </View>
  );
};

export default Create;
